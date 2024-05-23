# 계춘회 ScoreBoard  
스트리머 계춘회의 ScoreBoard FrontEnd repository 입니다.    
  
# 라이센스  
아래 리포지토리와 동일한 추가 사항을 포함한 MIT License 를 따릅니다.    
   
- 기본 : MIT License 를 따릅니다.  
- 추가 사항 : 사용된 이미지 저작권으로 인하여 수정이 필요합니다. 상업적 이용 전 문의 바랍니다.    
[PhysicksKim/FootballScoreBoard-gyechunhoe](https://github.com/PhysicksKim/FootballScoreBoard-gyechunhoe)    
  
<br><br>

---

<br><br>
  
# 개발용 인증 키 생성

## 프론트(React)용 .pem key 생성

로컬 개발용 인증 키를 mkcert 를 사용해서 발급받아 사용하세요.

```
brew install mkcert
```

```
mkcert -install
```

```
mkcert localhost
```

이후 home 경로 <code>/Users/사용자이름</code> 에 생성된 localhost-key.pem 파일과 localhost.pem 파일을 프로젝트 root 경로로 이동합니다.

## 백엔드(Spring)용 .p12 keystore 생성

이후 동일한 CA 로 부터 인증받은 p12 키를 생성해야지 로컬 개발에서 에러가 발생하지 않습니다.

```
openssl pkcs12 -export -in localhost.pem -inkey localhost-key.pem -out keystore.p12 -name [alias] -CAfile rootCA.pem -caname root
```

위에서 alias 를 기억해두도록 합니다. 키 이름에 사용되며 마치 로그인 시 id-password 에서 id 에 해당하는 게 alias 라고 생각하면 됩니다.  
위 명령을 입력하고 나면 아래와 같이 패스워드 입력 메세지가 출력됩니다.

```
Enter Export Password:
Verifying - Enter Export Password:
```

패스워드 입력, 동일 패스워드 verify 를 통과하고 나면 홈 디렉토리 <code>cd ~</code> 에서 keystore.p12 파일을 찾아 backend spring project 의 main/resources 에 위치시키고 dev 용 key 파일을 설정을 채워넣습니다.

```
application-dev.yml
```

```
server:
  port: 8083
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: yourpassword
    key-store-type: PKCS12
    key-alias: alias
    enabled: true
```

예를 들어 alias = scoreboard , password = 123456 이라고 했다면

```
server:
  port: 8083
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: 123456
    key-store-type: PKCS12
    key-alias: scoreboard
    enabled: true
```

으로 입력하면 됩니다.
