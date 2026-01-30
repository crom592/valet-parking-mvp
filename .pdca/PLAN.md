# 발렛 주차 관리 플랫폼 MVP - PDCA Plan

## 1. 프로젝트 개요
- **이름:** ValetPark MVP
- **목표:** 발렛 주차 업체가 차량 입출차를 관리하는 심플 플랫폼
- **타겟:** 호텔, 레스토랑, 이벤트장 발렛 주차 업체

## 2. 핵심 기능 (MVP Scope)

### 필수 기능 (Must Have)
- [ ] 차량 입차 등록 (차량번호, 키 위치, 주차 위치)
- [ ] 차량 출차 처리
- [ ] 실시간 주차 현황 대시보드
- [ ] 차량 검색 (번호판으로)

### 선택 기능 (Nice to Have - v2)
- [ ] 고객 SMS 알림
- [ ] QR 코드 티켓
- [ ] 매출 관리
- [ ] 다중 주차장 지원

## 3. 기술 스택
- **프론트엔드:** Next.js 14 + Tailwind CSS
- **백엔드:** Next.js API Routes
- **데이터베이스:** Supabase (PostgreSQL)
- **배포:** Vercel

## 4. 화면 구성
1. **메인 대시보드** - 현재 주차 현황
2. **입차 등록** - 새 차량 등록 폼
3. **출차 처리** - 차량 검색 & 출차
4. **차량 목록** - 전체 차량 리스트

## 5. 데이터 모델

```sql
-- vehicles 테이블
id: uuid
plate_number: string (차량번호)
key_location: string (키 보관 위치)
parking_spot: string (주차 위치)
status: enum ('parked', 'retrieved')
checked_in_at: timestamp
checked_out_at: timestamp
notes: string
```

## 6. 구현 단계

### Phase 1: 기반 구축 (30분)
- [ ] Next.js 프로젝트 생성
- [ ] Supabase 연동
- [ ] 기본 레이아웃

### Phase 2: 핵심 기능 (1시간)
- [ ] 입차 등록 기능
- [ ] 출차 처리 기능
- [ ] 차량 검색

### Phase 3: 대시보드 (30분)
- [ ] 실시간 현황 표시
- [ ] 통계 카드

### Phase 4: 마무리 (30분)
- [ ] UI 다듬기
- [ ] 배포
- [ ] README 작성

## 7. 예상 소요 시간
총 2-3시간
