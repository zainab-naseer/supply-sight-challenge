import { products, warehouses, kpis } from "../data/index.js";

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let result = products;

      if (search) {
        result = result.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (warehouse) {
        result = result.filter(p => p.warehouse === warehouse);
      }

      if (status) {
        if (status === "healthy") {
          result = result.filter(p => p.stock > p.demand);
        } else if (status === "low") {
          result = result.filter(p => p.stock === p.demand);
        } else if (status === "critical") {
          result = result.filter(p => p.stock < p.demand);
        }
      }

      return result;
    },
    warehouses: () => warehouses,
    kpis: (_, { range }) => {
      const n = parseInt(range, 10);
      return kpis.slice(-n);
    } 
  },

  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      product.demand = demand;
      return product;
    },

    transferStock: (_, { id, from, to, qty }) => {
      const product = products.find(p => p.id === id && p.warehouse === from);
      if (!product) throw new Error("Product not found in source warehouse");

      if (product.stock < qty) throw new Error("Not enough stock");

      product.stock -= qty;

      const target = products.find(p => p.id === id && p.warehouse === to);
      if (target) {
        target.stock += qty;
      } else {
        products.push({ ...product, warehouse: to, stock: qty });
      }

      return product;
    },
  },
};

export default resolvers;
