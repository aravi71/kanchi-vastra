-- Photos now live in the photo storage (Garage); Sanity is retired.
ALTER TABLE "ProductImage" ALTER COLUMN "provider" SET DEFAULT 'storage';
