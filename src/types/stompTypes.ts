export type RemoteCodeIssueMessage = {
  /**
   * 원격 연결에 사용되는 코드
   */
  remoteCode?: string;
  /**
   * code 발급 이후, subPath 를 subscribe 하여 원격 명령을 받을 수 있습니다.
   * subPath 양식 : /topic/board.{remoteCode}
   */
  subPath?: string;
  /**
   * 응답 코드
   */
  code: number;
  message: string;
};

export type RemoteConnectMessage = {
  pubPath: string;
};
