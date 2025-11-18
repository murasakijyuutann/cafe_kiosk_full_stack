import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

type Props = {
  /** 애니메이션 끝난 뒤 호출 (선택) */
  onComplete?: () => void;
  /** 총 재생 시간(ms). 기본 1100 */
  durationMs?: number;
  /** 커피 이미지 경로. 기본 이모지 fallback */
  imgSrc?: string;
};

const fly = keyframes`
  0%   { opacity: 0; transform: translate(-50%, 10px) scale(.7) rotate(0deg); filter: blur(1px); }
  18%  { opacity: 1; transform: translate(-50%, 0px)  scale(1.0) rotate(0deg); filter: blur(0); }
  65%  { opacity: 1; transform: translate(120px, -180px) scale(.95) rotate(-15deg); }
  100% { opacity: 0; transform: translate(240px, -280px) scale(.85) rotate(-25deg); filter: blur(1px); }
`;

const Pop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  30% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const Backdrop = styled.div<{ $duration: number }>`
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none; /* 클릭 막지 않음 */
  display: grid; place-items: center;
  overflow: hidden;

  /* 살짝 밝기 효과 */
  &::after{
    content:"";
    position: absolute; inset:0;
    background: radial-gradient(transparent 30%, rgba(0,0,0,0.08));
    animation: ${Pop} ${({ $duration }) => $duration * 0.5}ms ease-out;
  }
`;

const Cup = styled.img<{ $duration: number }>`
  width: 96px; height: 96px; object-fit: contain;
  transform: translate(-50%, 0);
  animation: ${fly} ${({ $duration }) => $duration}ms cubic-bezier(.18,.72,.22,.99) forwards;
  filter: drop-shadow(0 12px 22px rgba(0,0,0,.18));
`;

const EmojiCup = styled.div<{ $duration: number }>`
  font-size: 84px; line-height: 1;
  animation: ${fly} ${({ $duration }) => $duration}ms cubic-bezier(.18,.72,.22,.99) forwards;
  filter: drop-shadow(0 12px 22px rgba(0,0,0,.18));
`;

const OrderSuccessAnimation: React.FC<Props> = ({ onComplete, durationMs = 1100, imgSrc }) => {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onComplete]);

  return (
    <Backdrop $duration={durationMs}>
      {imgSrc ? (
        <Cup $duration={durationMs} src={imgSrc} alt="coffee" />
      ) : (
        <EmojiCup $duration={durationMs}>☕</EmojiCup>
      )}
    </Backdrop>
  );
};

export default OrderSuccessAnimation;
