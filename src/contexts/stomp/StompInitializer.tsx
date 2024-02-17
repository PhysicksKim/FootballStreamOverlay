import { Client, IMessage } from '@stomp/stompjs';
import React from 'react';
import {
  RemoteConnectInfos,
  RemoteCodeIssueMsg,
  RemoteConnectMsg,
  RemoteControlMsg,
  CodeIssueResponse,
} from '@src/types/stompTypes';

class StompInitializer {
  private clientRef: React.MutableRefObject<Client>;
  private boardRemoteSubCount = 0;

  constructor(clientRef: React.MutableRefObject<Client>) {
    if (clientRef.current === null) {
      console.error('clientRef is not set');
      return;
    }
    this.clientRef = clientRef;
  }

  public static subscribeTestHello = (
    clientRef: React.MutableRefObject<Client>,
  ) => {
    /**
     * 테스트용 Hello 메세지 수신
     */
    clientRef.current.subscribe(
      '/topic/hello',
      (message: IMessage) => {
        console.log('hello received : ', message);
      },
      { id: 'hello' },
    );
  };

  /**
   * 원격 연결 코드가 유효한지 확인합니다.
   * 원격 연결 코드는 0-9, a-z, A-Z 로 이루어진 6자리 문자열입니다.
   * @param remoteCode 원격 연결 코드
   * @returns 문자열 유효성
   */
  public static isValideRemoteCode: (remoteCode: string) => boolean = (
    remoteCode: string,
  ) => {
    return remoteCode.match(/^[0-9a-zA-Z]{6}$/) !== null;
  };

  public subCodeAndRemoteReceiveChannels = (
    setRemoteInfos: React.Dispatch<React.SetStateAction<RemoteConnectInfos>>,
    setRemoteControlMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>,
  ) => {
    this.clientRef.current.unsubscribe('remoteConnect');
    // 원격 제어 코드 수신
    this.clientRef.current.subscribe(
      '/user/topic/remote.receivecode',
      (message: IMessage) => {
        let remoteCodeMsg: RemoteCodeIssueMsg;
        try {
          remoteCodeMsg = this.parseCodeIssueMessage(message);
        } catch (e) {
          console.log('remote message error: ', e);
        }
        console.log('remote code : ', remoteCodeMsg);

        this.subRemoteReceiveChannel(
          remoteCodeMsg.remoteCode,
          remoteCodeMsg.subPath,
          remoteCodeMsg.pubPath,
          setRemoteInfos,
          setRemoteControlMsg,
        );
      },
      { id: 'remotecodeRcv' },
    );
  };

  private parseCodeIssueMessage: (message: IMessage) => CodeIssueResponse = (
    message,
  ) => {
    const remoteMsg: CodeIssueResponse = JSON.parse(message.body);
    if (remoteMsg.code !== 200) {
      throw new Error(`remoteCodeIssueMessage error ${remoteMsg}`);
    }
    return remoteMsg;
  };

  public subRemoteReceiveChannel = (
    remoteCode: string,
    subPath: string,
    pubPath: string,
    setRemoteInfo: React.Dispatch<React.SetStateAction<RemoteConnectInfos>>,
    setRemoteControlMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>,
  ) => {
    // 현재 구독 카운트를 증가시키고, 고유한 구독 ID를 생성합니다.
    const prevCount = this.boardRemoteSubCount;
    const prevSubId = `remoteMsg-${prevCount}`;
    const nextSubId = `remoteMsg-${prevCount + 1}`;
    setTimeout(() => {
      this.boardRemoteSubCount++;
    }, 0);

    // 이전에 존재하는 원격 메세지를 받는 채널 구독을 unSubscribe 합니다.
    if (this.clientRef.current) {
      this.clientRef.current.unsubscribe(prevSubId);

      this.clientRef.current.subscribe(
        subPath,
        (message: IMessage) => {
          try {
            const msg = JSON.parse(message.body);
            if (msg) {
              setRemoteControlMsg(msg);
            }
          } catch (e) {
            console.log('remoteControlMsg parse error : ', e);
          }
        },
        { id: nextSubId },
      );

      console.log('remote control channel sub : ', nextSubId);
      setRemoteInfo({
        remoteCode: remoteCode,
        subPath: subPath,
        pubPath: pubPath,
        subId: nextSubId,
      });
    }
    console.log('remote control channel unsub : ', prevSubId);
    // console.log('remote control channel sub : ', nextSubId);
  };

  // ----
  public subConnectAndRemoteReceiveChannels = (
    remoteCode: string,
    setRemoteInfos: React.Dispatch<React.SetStateAction<RemoteConnectInfos>>,
    setRemoteControlMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>,
  ) => {
    this.clientRef.current.unsubscribe('remoteConnect');
    /**
     * Remote connect 성공 메세지 수신
     */
    this.clientRef.current.subscribe(
      '/user/topic/remote.connect',
      (message: IMessage) => {
        console.log('remote.connect received : ', message);
        let remoteMsg: RemoteConnectMsg;
        try {
          remoteMsg = this.parseRemoteConnectMessage(message);
        } catch (e) {
          console.log('remote message error: ', e);
        }
        console.log('remote code : ', remoteMsg);

        this.subRemoteReceiveChannel(
          remoteCode,
          remoteMsg.subPath,
          remoteMsg.pubPath,
          setRemoteInfos,
          setRemoteControlMsg,
        );
      },
      { id: 'remoteConnect' },
    );
  };

  private parseRemoteConnectMessage = (message: IMessage) => {
    const remoteMsg: RemoteConnectMsg = JSON.parse(message.body);
    if (remoteMsg.code !== 200) {
      throw new Error('remoteCodeIssueMessage error');
    }
    return remoteMsg;
  };
}

export default StompInitializer;
