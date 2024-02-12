import { Client, IMessage } from '@stomp/stompjs';
import React from 'react';
import {
  BoardRemoteConnectInfos,
  ControlRemoteConnectInfos,
  RemoteCodeIssueMessage,
  RemoteConnectMessage,
  RemoteControlMsg,
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

  public subscribeTestHello = () => {
    /**
     * 테스트용 Hello 메세지 수신
     */
    this.clientRef.current.subscribe(
      '/topic/hello',
      (message: IMessage) => {
        console.log('hello received : ', message);
      },
      { id: 'hello' },
    );
  };

  public subscribeControlRemote = (
    setRemotePubInfo: React.Dispatch<
      React.SetStateAction<ControlRemoteConnectInfos>
    >,
  ) => {
    /**
     * Remote connect 성공 메세지 수신
     */
    this.clientRef.current.subscribe(
      '/user/topic/remote.connect',
      (message: IMessage) => {
        console.log('remote.connect received : ', message);
        let remoteMsg: RemoteConnectMessage;
        try {
          remoteMsg = this.parseControlRemoteMessage(message);
          setRemotePubInfo({
            pubPath: remoteMsg.pubPath,
          });
        } catch (e) {
          console.log('remote message error: ', e);
        }
        console.log('remote code : ', remoteMsg);
      },
      { id: 'remoteConnect' },
    );
  };

  private parseControlRemoteMessage = (message: IMessage) => {
    const remoteMsg: { code: number; pubPath: string } = JSON.parse(
      message.body,
    );
    if (remoteMsg.code !== 200 || !remoteMsg.pubPath) {
      throw new Error('remoteCodeIssueMessage error');
    }
    return remoteMsg;
  };

  public subscribeScoreBoardRemote = (
    setRemoteInfo: React.Dispatch<
      React.SetStateAction<BoardRemoteConnectInfos>
    >,
    setRemoteControlMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>,
  ) => {
    // 원격 제어 코드 수신
    this.clientRef.current.subscribe(
      '/user/topic/board/remotecode.receive',
      (message: IMessage) => {
        let remoteCodeMsg: RemoteCodeIssueMessage;
        try {
          remoteCodeMsg = this.parseScoreBoardRemoteMessage(message);
        } catch (e) {
          console.log('remote message error: ', e);
        }
        console.log('remote code : ', remoteCodeMsg);

        this.subRemoteControlChannel(
          remoteCodeMsg.remoteCode,
          remoteCodeMsg.subPath,
          setRemoteInfo,
          setRemoteControlMsg,
        );
      },
      { id: 'remotecodeRcv' },
    );
  };

  private parseScoreBoardRemoteMessage = (message: IMessage) => {
    const remoteMsg = JSON.parse(message.body);
    if (remoteMsg.code !== 200 || !remoteMsg.subPath) {
      throw new Error('remoteCodeIssueMessage error', remoteMsg);
    }
    return remoteMsg;
  };

  private subRemoteControlChannel = (
    remoteCode: string,
    remoteSubPath: string,
    setRemoteInfo: React.Dispatch<
      React.SetStateAction<BoardRemoteConnectInfos>
    >,
    setRemoteControlMsg: React.Dispatch<React.SetStateAction<RemoteControlMsg>>,
  ) => {
    // 현재 구독 카운트를 증가시키고, 고유한 구독 ID를 생성합니다.
    const prevCount = this.boardRemoteSubCount;
    const prevSubId = `remoteControlMsg-${prevCount}`;
    const nextSubId = `remoteControlMsg-${prevCount + 1}`;
    setTimeout(() => {
      this.boardRemoteSubCount++;
    }, 0);

    // 이전에 존재하는 원격 메세지를 받는 채널 구독을 unSubscribe 합니다.
    if (this.clientRef.current) {
      this.clientRef.current.unsubscribe(prevSubId);

      this.clientRef.current.subscribe(
        remoteSubPath,
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
        subPath: remoteSubPath,
        subId: nextSubId,
      });
    }
    console.log('remote control channel unsub : ', prevSubId);
    // console.log('remote control channel sub : ', nextSubId);
  };
}

export default StompInitializer;
