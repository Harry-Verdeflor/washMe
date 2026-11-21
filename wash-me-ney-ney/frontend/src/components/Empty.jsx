import { Shirt } from 'lucide-react';

export default function Empty({ text }) {
  return (
    <div className="empty">
      <Shirt size={30} />
      <strong>Nothing here yet</strong>
      <span>{text}</span>
    </div>
  );
}
