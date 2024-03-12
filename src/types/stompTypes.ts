import { FontInfo } from '@src/classes/FontEnum';
import { Client } from '@stomp/stompjs';
import { FontColorOptions, Team, TeamFontColor, TeamStyles } from './types';
import { UUID } from 'crypto';

export type RemoteCodeIssueMsg = {
  /**
   * 원격 연결에 사용되는 코드
   */
  remoteCode?: string;
  /**
   * code 발급 이후, subPath 를 subscribe 하여 원격 명령을 받을 수 있습니다.
   * subPath 양식 : /topic/board.{remoteCode}
   */
  subPath: string;
  pubPath: string;
  /**
   * 응답 코드
   */
  code: number;
  message: string;
};

// export type RemoteConnectMsg = {
//   code: number;
//   message: string;
//   subPath: string;
//   pubPath: string;
// };

export type StompClientRef = React.MutableRefObject<Client>;

export interface RemoteConnectInfos {
  remoteCode: string;
  subPath: string;
  pubPath: string;
  subId: string;
}

export interface RemoteInfos {
  subPath: string;
  pubPath: string;
  subId: string;
}

export interface RemoteCommonMessage {
  code: number;
  type: 'connect' | 'issue' | 'error' | 'sub' | 'autoreconnect';
  message: string;
  pubPath: string;
  subPath: string;
  remoteCode: string;
  autoRemote: boolean;
  cookieGetUrl: string;
  data?: any;
}

export type ConnectStatus = '연결됨' | '끊어짐';

export interface CodeIssueResponse {
  code: number;
  message: string;
  remoteCode: string;
  pubPath: string;
  subPath: string;
}

export type RemoteTimerMsg = {
  time: {
    min: number;
    sec: number;
  };
  milliseconds: number;
  isRunning: boolean;
};

export type ScorePayload = {
  teamAScore: number;
  teamBScore: number;
};

export type GivenInjuryPayload = {
  givenInjuryTime: number;
};

export type RemoteMsgDataPayload = ScorePayload | GivenInjuryPayload;

export interface BaseRemoteChannelMsg {
  code: number;
  message: string;
  metadata: {
    date: Date;
  };
}

export interface ControlChannelMsg extends BaseRemoteChannelMsg {
  type: 'control';
  data: {
    score: ScorePayload;
    givenInjury: GivenInjuryPayload;
  };
}

export interface MembersChannelMsg extends BaseRemoteChannelMsg {
  type: 'members';
  data: {
    members: string[];
  };
}

export type RemoteChannelMsg = ControlChannelMsg | MembersChannelMsg;
