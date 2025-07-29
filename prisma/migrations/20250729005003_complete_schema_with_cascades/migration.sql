/*
  Warnings:

  - Added the required column `atualizado_em` to the `itens_pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "especificacoes_produto" DROP CONSTRAINT "especificacoes_produto_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "imagens_produto" DROP CONSTRAINT "imagens_produto_variacao_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "itens_pedido" DROP CONSTRAINT "itens_pedido_pedido_id_fkey";

-- DropForeignKey
ALTER TABLE "itens_pedido" DROP CONSTRAINT "itens_pedido_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "variacoes_produto" DROP CONSTRAINT "variacoes_produto_produto_id_fkey";

-- AlterTable
ALTER TABLE "avaliacoes" ALTER COLUMN "comentario" DROP NOT NULL;

-- AlterTable
ALTER TABLE "itens_pedido" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "variacoes_produto" ADD CONSTRAINT "variacoes_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagens_produto" ADD CONSTRAINT "imagens_produto_variacao_produto_id_fkey" FOREIGN KEY ("variacao_produto_id") REFERENCES "variacoes_produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "especificacoes_produto" ADD CONSTRAINT "especificacoes_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
