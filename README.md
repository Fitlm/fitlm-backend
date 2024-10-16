# Fitlm Backend

## 프로젝트 개요

**Fitlm**은 사용자가 자신의 운동 사진을 저장하고 관리할 수 있는 개인 맞춤형 운동 사진 저장소입니다. 이 백엔드 프로젝트는 API 서버 역할을 하며, 사용자 인증, 데이터 저장 및 관리, 이미지 업로드 등의 기능을 제공합니다.

## 기술 스택

- **Node.js**: 서버 사이드 JavaScript 런타임 환경으로, 비동기 I/O 처리를 효율적으로 수행할 수 있습니다.
- **Express.js**: Node.js에서 서버와 API를 구현하기 위한 웹 프레임워크입니다.
- **MongoDB**: NoSQL 데이터베이스로, 유연한 데이터 구조를 저장하고 빠른 검색 및 관리가 가능합니다.
- **Mongoose**: MongoDB의 데이터를 쉽게 관리할 수 있도록 도와주는 ORM(Object Relational Mapping) 라이브러리입니다.

## 주요 기능

- **사용자 인증**: JWT(JSON Web Token)를 활용한 사용자 인증 및 권한 부여
- **운동 사진 저장**: 사용자별 사진 업로드 및 저장 기능
- **사진 조회 및 관리**: 사용자는 저장된 운동 사진을 조회하고 관리할 수 있습니다.
- **RESTful API**: 클라이언트와의 통신을 위해 REST API 구현

## 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/fitlm-backend.git
cd fitlm-backend
