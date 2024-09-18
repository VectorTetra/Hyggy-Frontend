import Link from 'next/link';
import jsonData from "./structure.json";

export default function WareList() {
  return (
    <div>
      {jsonData.map((product) => (
        <div key={product.id}>
          <h2>{product.productName}</h2>
          <Link href={`/ware/${product.id}`}>
            <b>Переглянути товар</b>
          </Link>
        </div>
      ))}
    </div>
  );
}
