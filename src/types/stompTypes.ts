import { FontInfo } from '@src/classes/FontEnum';
import { Client } from '@stomp/stompjs';
import { Team, TeamFontColor, TeamStyles } from './types';

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

export type StompClientRef = React.MutableRefObject<Client>;

export interface BoardRemoteConnectInfos {
  remoteCode: string;
  subPath: string;
  subId: string;
}

export interface ControlRemoteConnectInfos {
  pubPath: string;
}

export interface RemoteControlMsg {
  code: number;
  message: string;
  data: { [key: string]: any };
}

export type ConnectStatus = '연결됨' | '끊어짐';

/**
 * 원격 제어 수신/송신 메세지
 */
export interface RemoteMessage {
  /**
   * 200 : 정상 메세지
   * 400 : 에러 메세지
   */
  type: 'control' | 'error';
  data: {
    mainTimer: {
      time: {
        min: number;
        sec: number;
      };
      isRunning: boolean;
    };
    injuryTimer: {
      time: {
        min: number;
        sec: number;
      };
      isRunning: boolean;
    };
    injuryInfo: {
      givenInjuryTime: number;
      isShowInjuryTimer: boolean;
    };
    matchName: string;
    /**
     * FontEnum
     * ```
     * ONE_MOBILE_TITLE = 'ONE-Mobile-Title',
     * TAEBEAK = 'TAEBAEKfont',
     * ```
     */
    fontInfo: FontInfo;
    teamA: Team;
    teamB: Team;
    teamAStyle: TeamStyles;
    teamBStyle: TeamStyles;
    teamFontColor: TeamFontColor;
  };
}
