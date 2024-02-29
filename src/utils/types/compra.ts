export interface Compra {
  userId: string;
  parcelas: number;
  valorTotal: number;
  dataCompra: Date;
  status: "DEVENDO" | "PAGA";
}
