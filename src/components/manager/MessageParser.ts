interface RemoteJsonMessage {
  /**
   * @description 변경할 대상의 이름. ex) team
   */
  target: string;

  /**
   * @description 변경할 대상의 데이터.
   * ex)
   * {
   *   teamA: {
   *     code:'mci',
   *     score:'1',
   *     uniform:'away'
   *   },
   *   teamB: {
   *     code:'man',
   *     score:'2',
   *     uniform:'home'
   *   }
   * }
   */
  data: {
    [key: string]: string;
  };
}

class RemoteMessageParser {
  public parseMessage(message: string): RemoteJsonMessage {
    return JSON.parse(message);
  }
}
