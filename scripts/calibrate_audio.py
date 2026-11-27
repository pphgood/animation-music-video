#!/usr/bin/env python3
"""
动画音乐 MV 音频探针与精准裁剪脚本
功能：
  1. probe: 使用 ffprobe 检测音源规格，并按 0.25s 窗口输出指定时间段的 RMS 能量图，辅助定位气口与尾音。
  2. clip:  按精确起止秒数截取高光片段，施加平滑淡入/淡出与结尾留白，并可选导出首尾 6 秒核验切片。

用法示例：
  python calibrate_audio.py probe "song.mp3" --start 130 --end 145
  python calibrate_audio.py clip "song.mp3" "public/clip.mp3" --start 134.50 --end 224.45 --fade-in 0.45 --fade-out 0.70 --pad-total 91.00 --verify-dir "tmp_check"
"""

import argparse
import math
import os
import struct
import subprocess
import sys


def run_ffprobe(audio_path: str) -> None:
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration,bit_rate,format_name",
        "-show_entries", "stream=codec_name,sample_rate,channels",
        "-of", "default=noprint_wrappers=1",
        audio_path,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[ERROR] ffprobe failed:\n{res.stderr}", file=sys.stderr)
        sys.exit(1)
    print("=== Audio Metadata ===")
    print(res.stdout.strip())


def cmd_probe(args: argparse.Namespace) -> None:
    run_ffprobe(args.input)
    if args.start is None or args.end is None:
        return
    p = subprocess.run(
        [
            "ffmpeg", "-v", "error", "-i", args.input,
            "-ac", "1", "-ar", "8000", "-f", "s16le", "-",
        ],
        capture_output=True,
    )
    if p.returncode != 0:
        print(f"[ERROR] ffmpeg decode failed:\n{p.stderr.decode(errors='ignore')}", file=sys.stderr)
        sys.exit(1)
    data = p.stdout
    samples = struct.unpack(f"<{len(data) // 2}h", data)
    print(f"\n=== RMS Envelope ({args.start:.2f}s -> {args.end:.2f}s, step={args.step}s) ===")
    t = args.start
    while t < args.end:
        i0 = max(0, int(t * 8000))
        i1 = min(len(samples), int((t + args.step) * 8000))
        seg = samples[i0:i1]
        r = math.sqrt(sum(x * x for x in seg) / max(1, len(seg))) / 32768.0
        m, s = divmod(t, 60)
        bar = "#" * int(r * 42)
        print(f"{int(m):02d}:{s:05.2f} ({t:6.2f}s) {r:.3f} {bar}")
        t += args.step


def cmd_clip(args: argparse.Namespace) -> None:
    dur = args.end - args.start
    if dur <= 0:
        print("[ERROR] --end must be greater than --start", file=sys.stderr)
        sys.exit(1)
    os.makedirs(os.path.dirname(os.path.abspath(args.output)), exist_ok=True)
    filters = []
    if args.fade_in > 0:
        filters.append(f"afade=t=in:st=0:d={args.fade_in:.2f}")
    if args.fade_out > 0:
        fo_st = max(0.0, dur - args.fade_out)
        filters.append(f"afade=t=out:st={fo_st:.2f}:d={args.fade_out:.2f}")
    total_dur = args.pad_total if args.pad_total and args.pad_total > dur else dur
    if args.pad_total and args.pad_total > dur:
        filters.append(f"apad=whole_dur={args.pad_total:.2f}")

    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-ss", f"{args.start:.3f}",
        "-t", f"{dur:.3f}",
        "-i", args.input,
    ]
    if filters:
        cmd += ["-af", ",".join(filters)]
    cmd += ["-c:a", "libmp3lame", "-b:a", "256k", "-ar", "44100", "-ac", "2", args.output]
    subprocess.run(cmd, check=True)
    print(f"[OK] Clipped {args.start:.2f}s -> {args.end:.2f}s (padded to {total_dur:.2f}s) => {args.output}")
    print(f"     Suggested 30fps TOTAL_FRAMES = {round(total_dur * 30)}")
    run_ffprobe(args.output)

    if args.verify_dir:
        os.makedirs(args.verify_dir, exist_ok=True)
        head_out = os.path.join(args.verify_dir, "verify_head.mp3")
        tail_out = os.path.join(args.verify_dir, "verify_tail.mp3")
        tail_start = max(0.0, total_dur - 6.0)
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-ss", "0", "-t", "6", "-i", args.output, head_out],
            check=True,
        )
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-ss", f"{tail_start:.2f}", "-t", "6", "-i", args.output, tail_out],
            check=True,
        )
        print(f"[OK] Edge verification clips saved:\n     - {head_out}\n     - {tail_out}")


def main() -> None:
    parser = argparse.ArgumentParser(description="MV 音频探针与精准裁剪工具")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_probe = sub.add_parser("probe", help="检测音频参数与指定区间 RMS 能量")
    p_probe.add_argument("input", help="输入音频路径")
    p_probe.add_argument("--start", type=float, default=None, help="波形分析起始秒")
    p_probe.add_argument("--end", type=float, default=None, help="波形分析结束秒")
    p_probe.add_argument("--step", type=float, default=0.25, help="采样步长(秒)")
    p_probe.set_defaults(func=cmd_probe)

    p_clip = sub.add_parser("clip", help="精确截取音频片段并生成首尾核验切片")
    p_clip.add_argument("input", help="输入完整音频路径")
    p_clip.add_argument("output", help="输出片段音频路径")
    p_clip.add_argument("--start", type=float, required=True, help="截取起点(秒)")
    p_clip.add_argument("--end", type=float, required=True, help="截取终点(秒)")
    p_clip.add_argument("--fade-in", type=float, default=0.45, help="淡入时长(秒)")
    p_clip.add_argument("--fade-out", type=float, default=0.70, help="淡出时长(秒)")
    p_clip.add_argument("--pad-total", type=float, default=None, help="结尾补静音至总时长(秒)")
    p_clip.add_argument("--verify-dir", type=str, default=None, help="导出首尾6秒核验切片目录")
    p_clip.set_defaults(func=cmd_clip)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
