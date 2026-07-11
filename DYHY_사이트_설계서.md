# DYHY 포트폴리오 사이트 설계서

## 1. 개요

| 항목 | 내용 |
|---|---|
| 브랜드명 | DYHY |
| 목적 | 협업·협찬 제안 유치용 작가 포트폴리오 (표면상 프로페셔널 포폴) |
| 주력 장르 | 인물 · 인테리어 · 스트릿 |
| 분위기 | 미니멀 화이트, 화사하게 |
| 도메인 | studio.lusterwind.space |
| 배포 | Vercel (무료) |
| 이미지 | Cloudinary (무료 티어) |
| 연락 | 폼 없음, Instagram DM 유도 |
| 다국어 | 없음 (한국어) |
| 사진 추가 | 데이터 파일 수정 → 재배포 |

## 2. 사이트맵

```
/            메인 (Home)
/works       작례 갤러리 (카테고리 필터: All / Portrait / Interior / Street)
/about       작가 2인 소개·약력
/contact     연락처 (Instagram DM 유도)
```

## 3. 페이지별 상세

### 3-1. 메인 (Home)
- 풀스크린 히어로: 대표작 슬라이드(3~5장, 페이드 전환 5초 간격) 또는 고정 1장
- 한 줄 소개 문구 (예: "빛과 공간, 사람을 담습니다")
- 대표작 큐레이션 그리드 6~9장 → 클릭 시 /works 이동
- "View all works →" CTA
- 푸터: © DYHY, Instagram 아이콘 링크
- 모바일: 히어로는 세로 크롭 대응(모바일용 크롭 이미지 별도 지정), 그리드 1~2열

### 3-2. 작례 (Works)
- 상단 카테고리 필터 칩: All / Portrait / Interior / Street (URL 쿼리로 상태 유지 권장)
- Masonry 그리드 (데스크톱 3열, 태블릿 2열, 모바일 1~2열)
- 클릭 시 라이트박스(원본 확대 + 좌우 이동 + 캡션)
- 이미지 lazy loading 필수

### 3-3. 작가 (About)
- 작가 2인 프로필: 프로필 사진 + 이름/활동명 + 소개 문단 + 주력 장르 + 약력 + 개인 인스타 링크
- 데스크톱: 좌우 지그재그 배치 / 모바일: 세로 스택

### 3-4. 연락 (Contact)
- 폼 없음. 큰 타이포 "Let's work together" + 안내 한 줄
- Instagram DM 버튼(작가별) + 이메일 링크(mailto)
- 협찬 문의를 직접 언급하지 않되 "촬영 문의·협업 제안 환영" 정도의 뉘앙스

## 4. 기술 스택

- **Vite + React + React Router** (SPA)
- 스타일: Tailwind CSS 권장 (반응형 유틸리티로 모바일/데스크톱 분기 용이)
- 라이트박스: `yet-another-react-lightbox` 등 경량 라이브러리
- 사진 데이터: `src/data/photos.json` — 코드 수정 없이 JSON만 고쳐서 재배포

```json
{
  "id": "p001",
  "cloudinaryId": "dyhy/portrait/xxxx",
  "category": "portrait",
  "title": "작품명(선택)",
  "featured": true
}
```

## 5. Cloudinary 운용

- 폴더: `dyhy/portrait`, `dyhy/interior`, `dyhy/street`, `dyhy/profile`
- URL 변환 파라미터로 썸네일/원본 분리 (별도 리사이즈 작업 불필요)
  - 썸네일: `f_auto,q_auto,w_600`
  - 라이트박스 원본: `f_auto,q_auto,w_2000` (긴 변 2000px 제한 → 도용 대응 겸용)
- `f_auto`가 브라우저별 WebP/AVIF 자동 서빙

## 6. OG 미리보기 (링크 공유)

- SPA 특성상 크롤러는 JS 미실행 → **index.html에 정적 메타태그 직접 삽입** (사이트 전체 공통 1세트로 충분)
- og:title "DYHY — Photography Portfolio", og:description 한 줄 소개, og:image 대표작 1200×630 (Cloudinary URL), og:url https://studio.lusterwind.space
- twitter:card `summary_large_image` 추가
- 배포 후 카카오톡/슬랙에 링크 붙여 미리보기 확인 (카카오는 https://developers.kakao.com 의 공유 디버거로 캐시 갱신)

## 7. Vercel 배포 + 서브도메인 연결

1. GitHub 레포 → Vercel Import → 자동 빌드/배포
2. Vercel 프로젝트 Settings → Domains → `studio.lusterwind.space` 추가
3. lusterwind.space DNS 관리처에서 CNAME 레코드 추가: `studio` → `cname.vercel-dns.com`
4. SSL 자동 발급 (수 분 소요)
5. SPA 라우팅 404 대응: `vercel.json`에 rewrite 설정

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 8. 반응형 기준

| 구간 | 폭 | 갤러리 열 수 |
|---|---|---|
| 모바일 | ~640px | 1~2열, 햄버거 메뉴 |
| 태블릿 | 640~1024px | 2열 |
| 데스크톱 | 1024px~ | 3열, 상단 텍스트 네비 |

## 9. 기타

- 사진 도용: 업로드 해상도 제한(긴 변 2000px). 우클릭 방지는 불필요(효과 미미, UX 저해)
- 성능 목표: Lighthouse 90+ — lazy loading, 폰트 1종(가벼운 산세리프, 예: Pretendard) 만으로 충분
- 파비콘 + 애플 터치 아이콘: DYHY 워드마크 심플하게
- 접근성: 모든 사진에 alt 텍스트 (JSON에 필드 포함 권장)

## 10. 필요 자료 체크리스트 (개발 착수 전)

- [ ] 히어로용 대표작 3~5장
- [ ] 갤러리 사진 카테고리별 최소 6장씩
- [ ] 작가 2인 프로필 사진 + 소개문 + 약력
- [ ] 인스타그램 계정 URL (작가별)
- [ ] 연락용 이메일 주소
- [ ] OG용 대표 이미지 1장 (1200×630 크롭)
