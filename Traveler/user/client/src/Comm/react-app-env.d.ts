//2025.01.24. 17:20 생성자: 이학수, react-modal-video 타입 정의를 강제로 재정의
declare module "react-modal-video" {
    import { Component } from "react";
  
    export interface ModalVideoProps {
      channel: "youtube" | "vimeo" | "custom";
      isOpen: boolean;
      videoId: string;
      onClose: () => void;
      autoplay?: boolean;
      allowFullScreen?: boolean;
      classNames?: {
        modalVideo?: string;
        modalVideoClose?: string;
        modalVideoBody?: string;
        modalVideoInner?: string;
        modalVideoIframeWrap?: string;
        modalVideoCloseBtn?: string;
        modalVideoEffect?: string;
      };
    }
  
    export default class ModalVideo extends Component<ModalVideoProps> {}
  }
  