# PrepNote
발표 준비, 한눈에 정리하다

PrepNote는 발표 자료 요약부터 발표 대본 생성, 리허설 피드백, 예상 Q&A까지  
발표 준비 전 과정을 AI가 지원하는 웹서비스입니다.

<p align="center">
  <a href="https://youtu.be/S5WwsNBhHhA">
    <img src="https://img.shields.io/badge/Demo%20Video-YouTube-red?style=for-the-badge" />
  </a>
  <a href="./PrepNote.pptx">
    <img src="https://img.shields.io/badge/PPT-Download-blue?style=for-the-badge" />
  </a>
</p>

---

## Key Features
1) 발표 자료 요약 및 슬라이드 구조 정리  
- 입력: 보고서/논문/자료 텍스트  
- 출력: 발표 요약 + 슬라이드 구성 안내  
- AI: OpenAI API :contentReference[oaicite:1]{index=1}

2) 발표 대본 생성 (말투 스타일 + 발표자 수 반영)  
- 입력: 슬라이드 요약본 + 말투 스타일 + 발표자 수  
- 출력: 발표자별 분리 대본(순서/시간 포함)  
- AI: OpenAI API :contentReference[oaicite:2]{index=2}

3) 리허설 피드백 및 점수화  
- 입력: 대본/음성/영상  
- 출력: 말 빠르기, 반복어 빈도, 시간 정확도, 항목별 점수 및 총점(100점)  
- AI/기술: Speech-to-Text, Face API, 내부 점수화 로직 :contentReference[oaicite:3]{index=3}

4) 예상 질문 및 답변 생성  
- 입력: 발표 주제 요약  
- 출력: 예상 질문 3~5개 + 모범 답변 예시  
- AI: OpenAI API :contentReference[oaicite:4]{index=4}

5) 발표 리포트 시각화  
- 입력: 피드백/점수 데이터  
- 출력: 그래프/차트 기반 리포트 :contentReference[oaicite:5]{index=5}

---

## Expected Benefits
- 발표 준비를 더 체계적으로 진행할 수 있음
- 반복 연습과 점수화된 피드백으로 발표 완성도 향상
- 발표 준비 시간 단축 및 발표 역량 강화
- 팀 발표에서도 발표자 수에 맞춰 대본 자동 분할 제공 :contentReference[oaicite:6]{index=6}

---

## Target Users
- 초/중/고 학생: 수업 발표, 동아리, 대회 발표
- 대학생: 과제, 팀플, 세미나, 졸업작품 발표
- 직장인: 회의, 보고서 발표, 프로젝트 프레젠테이션 :contentReference[oaicite:7]{index=7}

---

## Tech Stack
- Frontend: React (Vercel)
- Backend: Python FastAPI/Flask (Render)
- AI: OpenAI API, Google Speech-to-Text
- Database: Firebase / Firestore
- Visualization: Plotly, Chart.js :contentReference[oaicite:8]{index=8}

---

## Workflow
1. 회원가입 후 학년/직장인 선택
2. 자료 업로드 및 발표용 요약 생성
3. 발표자 수/말투 스타일 선택 후 대본 생성
4. 리허설 진행 후 점수 포함 피드백 리포트 확인
5. 예상 질문/답변 생성
6. 결과 저장 및 다운로드 :contentReference[oaicite:9]{index=9}

---

## Repository Structure
- backend/ : FastAPI 서버
- frontend/ : React 웹앱
