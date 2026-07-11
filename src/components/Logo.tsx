/**
 * DYHY 로고 — 도윤(DY)·하영(HY)의 이니셜 락업.
 * D/H를 세로로 쌓고, 그 전체 높이(캡 기준 1.52em)에 맞춘 큰 Y를 옆에 배치한다.
 * 좌표는 Pretendard 600의 캡 높이(0.71em) 실측값 기준: D/H 100pt, Y 214pt.
 * D–H 사이 간격(10)을 줄일수록 Y도 작아져 높이가 항상 일치한다.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 232 152"
      className={`h-[1.52em] w-auto overflow-visible ${className}`}
      role="img"
      aria-label="DYHY"
      fill="currentColor"
    >
      <text x="36" y="71" fontSize="100" fontWeight="600" textAnchor="middle">
        D
      </text>
      <text x="36" y="152" fontSize="100" fontWeight="600" textAnchor="middle">
        H
      </text>
      <text x="160" y="152" fontSize="214" fontWeight="600" textAnchor="middle">
        Y
      </text>
    </svg>
  );
}
