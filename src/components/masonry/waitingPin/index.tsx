import { WaitingContainer } from './styled';

export default function WaitingPin({ alonePin }: { alonePin?: boolean }) {
  return (
    <WaitingContainer id="waiting-pin" $alonePin={alonePin}>
      <div className="loading">
        <div></div>
      </div>
    </WaitingContainer>
  );
}
