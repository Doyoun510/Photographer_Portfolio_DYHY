# DYHY 포트폴리오 사이트 — 구현 지시서 (Claude Code용)

> 이 문서를 프로젝트 루트에 두고 Claude Code에게 "이 지시서대로 구현해줘"라고 요청하세요.
> 배경 설계는 `DYHY_사이트_설계서.md` 참고 (같이 넣어주면 좋음).

## 프로젝트 개요

사진 작가 2인의 포트폴리오 정적 사이트. 백엔드 없음. 미니멀 화이트 톤, 화사한 분위기. 사진이 주인공이므로 UI 장식은 최소화한다.

## 기술 스택 (변경 금지)

- Vite + React 18 + React Router v6 (SPA)
- Tailwind CSS
- 라이트박스: yet-another-react-lightbox
- 이미지: Cloudinary URL 직접 사용 (SDK 불필요, URL 변환 파라미터만 사용)
- 상태관리 라이브러리 금지 (useState/URL 쿼리로 충분)
- TypeScript 사용

## 프로젝트 구조

```
src/
  main.tsx
  App.tsx                # Router 정의
  index.css              # Tailwind + 전역 스타일
  data/
    photos.json          # 사진 데이터 (아래 스키마)
    artists.json         # 작가 2인 데이터
    site.json            # 사이트 공통 텍스트 (히어로 문구, 이메일, 인스타 URL)
  lib/
    cloudinary.ts        # URL 빌더 (썸네일/원본)
  components/
    Header.tsx           # 데스크톱 텍스트 네비 / 모바일 햄버거
    Footer.tsx
    PhotoGrid.tsx        # masonry 그리드 + lazy loading
    Lightbox.tsx
    Hero.tsx             # 페이드 슬라이드 (5초 간격)
    FilterChips.tsx
  pages/
    Home.tsx
    Works.tsx
    About.tsx
    Contact.tsx
```

## 데이터 스키마

photos.json:
```json
[{
  "id": "p001",
  "cloudinaryId": "dyhy/portrait/sample01",
  "category": "portrait",
  "alt": "사진 설명",
  "featured": true
}]
```
- category: "portrait" | "interior" | "street"
- featured: true인 사진만 홈 그리드에 노출 (6~9장)

artists.json:
```json
[{
  "id": "a1",
  "name": "작가 이름",
  "role": "Photographer",
  "bio": "소개 문단",
  "career": ["약력1", "약력2"],
  "instagram": "https://instagram.com/...",
  "profileCloudinaryId": "dyhy/profile/a1"
}]
```

## lib/cloudinary.ts

```ts
const BASE = "https://res.cloudinary.com/<CLOUD_NAME>/image/upload";
export const thumb = (id: string) => `${BASE}/f_auto,q_auto,w_600/${id}`;
export const full  = (id: string) => `${BASE}/f_auto,q_auto,w_2000/${id}`;
export const hero  = (id: string) => `${BASE}/f_auto,q_auto,w_1600/${id}`;
```
CLOUD_NAME은 `.env`의 `VITE_CLOUDINARY_CLOUD_NAME`으로 주입.

## 페이지 요구사항

### / (Home)
1. 풀스크린(100svh) 히어로: featured 사진 중 3~5장 페이드 전환(5초), 좌하단에 "DYHY" 워드마크 + 한 줄 소개(site.json)
2. 히어로 아래: featured 그리드 (데스크톱 3열 / 모바일 2열), 클릭 시 /works 이동
3. "View all works →" 링크
4. 스크롤 진입 시 사진 fade-in (IntersectionObserver, 라이브러리 금지)

### /works
1. 필터 칩: All / Portrait / Interior / Street — 선택 상태는 URL 쿼리(?c=portrait)로 유지
2. masonry 그리드: 데스크톱 3열, 태블릿 2열, 모바일 2열 (CSS columns 사용)
3. 클릭 시 라이트박스 (좌우 이동, ESC 닫기, full 해상도)
4. 모든 img에 loading="lazy", alt 필수

### /about
1. 작가 2인, 데스크톱은 좌우 지그재그(사진-텍스트 / 텍스트-사진), 모바일은 세로 스택
2. 각: 프로필 사진, 이름, role, bio, 약력 리스트, 인스타그램 링크

### /contact
1. 중앙 정렬 큰 타이포 "Let's work together"
2. 안내 한 줄: "촬영 문의와 협업 제안을 환영합니다"
3. 버튼 3개: 작가별 Instagram DM (인스타 프로필로 새 탭), 이메일(mailto)
4. 폼 없음

## 공통

- Header: 데스크톱은 우측 텍스트 네비(Works/About/Contact), 모바일(<768px)은 햄버거 → 풀스크린 오버레이 메뉴. 로고 "DYHY"는 letter-spacing 넓게
- 폰트: Pretendard (CDN), 본문 회색조(text-neutral-800/500), 배경 흰색
- Footer: © DYHY, 인스타 아이콘 링크
- 페이지 전환 시 스크롤 최상단 리셋

## index.html 메타태그 (정적 삽입, 필수)

```html
<title>DYHY — Photography Portfolio</title>
<meta name="description" content="인물, 인테리어, 스트릿 — DYHY 포토그래피" />
<meta property="og:title" content="DYHY — Photography Portfolio" />
<meta property="og:description" content="인물, 인테리어, 스트릿 — DYHY 포토그래피" />
<meta property="og:image" content="<Cloudinary 1200x630 URL>" />
<meta property="og:url" content="https://studio.lusterwind.space" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

## 배포 설정

- `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- 도메인: studio.lusterwind.space (CNAME → cname.vercel-dns.com, 사용자가 직접 설정)

## 개발 편의

- 실제 Cloudinary 업로드 전까지 https://picsum.photos 플레이스홀더로 동작하도록 cloudinary.ts에 `VITE_USE_PLACEHOLDER=true` 분기 추가
- photos.json에 카테고리별 6장씩 더미 데이터 채워둘 것

## 완료 기준 (체크리스트)

- [ ] `npm run build` 에러 없이 통과
- [ ] 4개 라우트 모두 동작, 새로고침해도 404 없음(dev 기준)
- [ ] 375px / 768px / 1440px 폭에서 레이아웃 깨짐 없음
- [ ] Works 필터가 URL 쿼리로 유지되고 뒤로가기 동작
- [ ] 라이트박스 키보드(←/→/ESC) 동작
- [ ] 모든 이미지 alt, lazy loading 적용
- [ ] Lighthouse 성능 90+ (플레이스홀더 기준)

## 하지 말 것

- 협찬/광고 유치 문구를 노골적으로 넣지 말 것
- 우클릭 방지 스크립트 넣지 말 것
- 다크모드, 다국어, CMS 연동 구현하지 말 것
- 과한 애니메이션(패럴럭스 등) 금지 — fade 정도만
