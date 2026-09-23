-- CreateTable
CREATE TABLE "_ProductCollections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductCollections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductCollections_B_index" ON "_ProductCollections"("B");

-- AddForeignKey
ALTER TABLE "_ProductCollections" ADD CONSTRAINT "_ProductCollections_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCollections" ADD CONSTRAINT "_ProductCollections_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
