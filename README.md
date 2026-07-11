# DYHY — Photography Portfolio

사진 작가 2인(**도윤 · 하영**)의 포트폴리오 사이트. 미니멀 화이트 톤, 사진이 주인공인 정적 SPA.

🔗 **studio.lusterwind.space** (배포 예정)

---

## 기술 스택

- **Vite + React 18 + React Router v6** (SPA)
- **Tailwind CSS** — 반응형 유틸리티
- **yet-another-react-lightbox** — 이미지 확대 뷰
- **Cloudinary** — 이미지 호스팅 (URL 변환 파라미터로 썸네일/원본 자동 리사이즈)
- **TypeScript**
- 백엔드/상태관리 라이브러리 없음

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 풀스크린 히어로(페이드 슬라이드) + 대표작 그리드 |
| `/works` | 카테고리 필터(All / Interior / Cafe / Portrait / Street) + 마소너리 그리드 + 라이트박스 |
| `/about` | 작가 2인 소개·약력 |
| `/contact` | Instagram DM · 이메일 연락 (폼 없음) |

---

## 로컬 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 (tsc 타입체크 + vite build)
npm run preview  # 빌드 결과 미리보기
```

## 환경 변수 (`.env`)

```bash
VITE_USE_PLACEHOLDER=true          # true: 임시 이미지(picsum) / false: 실제 Cloudinary 이미지
VITE_CLOUDINARY_CLOUD_NAME=xxxxx   # Cloudinary 대시보드의 Cloud Name
```

> 실제 사진을 연결하기 전까지는 `VITE_USE_PLACEHOLDER=true`로 두면 임시 이미지로 레이아웃을 확인할 수 있습니다.
> 사진 준비가 끝나면 `false` + 실제 Cloud Name으로 바꾸세요.

---

## 📸 사진 추가 / 교체 (운영 가이드)

**코드는 건드리지 않습니다.** 아래 3단계만 반복하면 됩니다.

### 1. Cloudinary 업로드

Cloudinary Media Library의 `dyhy` 폴더 안, 카테고리별 하위 폴더에 업로드:

| 폴더 | 용도 |
|---|---|
| `dyhy/interior` | 인테리어 (집·숙소) |
| `dyhy/cafe` | 카페·레스토랑 |
| `dyhy/portrait` | 인물 스냅 |
| `dyhy/street` | 스트릿 |
| `dyhy/profile` | 작가 프로필 사진 |

### 2. `src/data/photos.json` 수정

사진 한 장 = 객체 하나:

```json
{
  "id": "p001",
  "cloudinaryId": "dyhy/cafe/IMG_0123",
  "category": "cafe",
  "alt": "따뜻한 조명의 카페 카운터",
  "featured": true
}
```

| 필드 | 설명 |
|---|---|
| `id` | 고유 값 (겹치지만 않으면 됨) |
| `cloudinaryId` | Cloudinary **public ID** (폴더 경로 + 파일명, 확장자 제외) |
| `category` | `interior` / `cafe` / `portrait` / `street` 중 하나 |
| `alt` | 사진 설명 (접근성·SEO, 필수) |
| `featured` | `true`면 홈 그리드 노출. featured 중 **앞 4장이 히어로 슬라이드** |

> 이미지 URL(`https://res.cloudinary.com/.../upload/`, 확장자, 버전)은 `src/lib/cloudinary.ts`가 자동으로 조립합니다. `cloudinaryId`만 넣으면 됩니다.

### 3. 커밋 & 푸시

```bash
git add .
git commit -m "사진 추가"
git push
```

→ Vercel이 자동으로 재빌드·배포 (CI/CD).

작가 정보는 `src/data/artists.json`, 사이트 공통 문구(이메일·태그라인)는 `src/data/site.json`에서 수정합니다.

---

## 프로젝트 구조

```
src/
  main.tsx / App.tsx      # 진입점 · 라우터
  index.css               # Tailwind + 전역 스타일
  types.ts                # 공용 타입 (Category 등)
  data/
    photos.json           # 사진 데이터  ← 주로 수정
    artists.json          # 작가 2인
    site.json             # 공통 텍스트
  lib/
    cloudinary.ts         # 이미지 URL 빌더 (placeholder 분기 포함)
  components/
    Header · Footer · Logo
    Hero                  # 히어로 페이드 슬라이드
    PhotoGrid             # 마소너리 + IntersectionObserver fade-in
    FilterChips · Lightbox
  pages/
    Home · Works · About · Contact
```

---

## 배포 (Vercel)

1. GitHub 레포를 Vercel에 **Import** (Vite 자동 인식)
2. 환경 변수(`VITE_USE_PLACEHOLDER`, `VITE_CLOUDINARY_CLOUD_NAME`) 등록
3. **Settings → Domains**에서 `studio.lusterwind.space` 추가
4. DNS에 CNAME 레코드: `studio` → `cname.vercel-dns.com`

SPA 라우팅(새로고침 404) 대응은 `vercel.json`의 rewrite로 이미 처리되어 있습니다.
```
