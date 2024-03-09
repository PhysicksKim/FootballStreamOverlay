class RemoteUtil {
  /**
   * 원격 연결 코드가 유효한지 확인합니다.
   * 원격 연결 코드는 0-9, a-z, A-Z 로 이루어진 6자리 문자열입니다.
   * @param remoteCode 원격 연결 코드
   * @returns 문자열 유효성
   */
  public static isValideRemoteCode: (remoteCode: string) => boolean = (
    remoteCode: string,
  ) => {
    if (typeof remoteCode !== 'string') return false;
    return remoteCode.match(/^[0-9a-zA-Z]{6}$/) !== null;
  };
}

export default RemoteUtil;
