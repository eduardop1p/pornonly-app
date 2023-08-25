import { WaitingContainer } from './styled';

export default function WaitingPin() {
  return (
    <WaitingContainer id="waiting-pin">
      <div className="loading">
        <div></div>
      </div>
    </WaitingContainer>
  );
}
