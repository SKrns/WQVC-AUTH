# WQVC-AUTH

WQVC(WebRTC-QUIC Video Conference)의 AUTH Server. 회의 생성, 채팅 참가, 회의 참가가 가능하다.

## 사전 설치 요구사항
위 서비스를 사용하기 전에 `https://github.com/Pororo-droid/WQVC-eurkeaServer`가 필요하다.

## 설치 방법
### 1) 컨테이너 실행

Dockerfile을 빌드 한다.

```
docker build -t [생성할 이미지 이름] .
```

이 후, 생성한 이미지를 실행한다.

```
docker run --link [유레카 컨테이너 이름] -p 7000:7000 -t [생성한 이미지 이름]
```



### 2) 일반 실행


깃 레포와 dependency 설치

```
git clone https://github.com/SKrns/WQVC-AUTH.git
cd WQVC-AUTH

npm install
```

`.env`파일을 하나 만들어 다음과 같이 설정.

```
PORT = 7000
CONNECTIONSTRING = postgresql://postgres:Dndus243!@101.101.211.230:5432/modo
HOSTNAME = localhost
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE = [유레카서버주소 예: localhost]
```



마지막으로 서버를 실행시키고 다음 링크로 들어간다. `http://localhost:7000/`

```
node index.js
```

## 사용방법 (OIDC)
### 회원가입

다음 주소`http://slb-4957600.ncloudslb.com/`로 들어가 이름, 이메일 주소, 비밀번호와 약관동의를 누르고 계정 만들기를 누른다.
![sign](images/main.png)


###  로그인
방금 만든 계정의 이메일과 비밀번호를 로그인을 누르고 로그인 한다.
![login](images/login.png)

### 회의생성
로그인후 회의생성을 누르고 회의이름, 내용, 시작날짜, 그리고 초대할 사람들의 이메일을 작성하고 회의 생성을 누른다.
![make_conference](images/make_conference.png)

### 회의 혹은 채팅 참가
미리 만들어진 회의에 참가를 할 수 있다.
![result](images/result.png)