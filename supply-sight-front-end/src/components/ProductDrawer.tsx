import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Package, MapPin, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { RootState } from '../store';
import { setDrawerOpen, updateProductDemand, transferStock } from '../store/slices/dashboardSlice';
import { getStatusColor, getStatusIcon } from '../utils/statusUtils';

import { useMutation } from "@apollo/client/react";

import { gql } from '@apollo/client';

const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      name
      warehouse
      sku
      stock
      demand
    }
  }
`;

const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) {
      id
      name
      warehouse
      sku
      stock
      demand
    }
  }
`;
const ProductDrawer: React.FC = () => {

const [updateDemandMutation] = useMutation(UPDATE_DEMAND);
const [transferStockMutation] = useMutation(TRANSFER_STOCK);

  const dispatch = useDispatch();
  const { selectedProduct, isDrawerOpen, warehouses } = useSelector((state: RootState) => state.dashboard);
  
  const [newDemand, setNewDemand] = useState<string>('');
  const [transferQty, setTransferQty] = useState<string>('');
  const [transferFrom, setTransferFrom] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>('');

  const handleUpdateDemand = async (e: React.FormEvent) => {
  e.preventDefault();
  if (selectedProduct && newDemand) {
    try {
      const { data } = await updateDemandMutation({
        variables: { id: selectedProduct.id, demand: parseInt(newDemand) }
      });

      if (data?.updateDemand) {
        dispatch(updateProductDemand({
          id: data.updateDemand.id,
          demand: data.updateDemand.demand
        }));
        alert("Demand updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update demand");
    } finally {
      dispatch(setDrawerOpen(false))
    }
  }
};

const handleTransferStock = async (e: React.FormEvent) => {
  e.preventDefault();
  if (selectedProduct && transferQty && transferFrom && transferTo) {
    try {
      const { data } = await transferStockMutation({
        variables: {
          id: selectedProduct.id,
          from: transferFrom,
          to: transferTo,
          qty: parseInt(transferQty)
        }
      });

      if (data?.transferStock) {
        // update Redux with server response
        dispatch(transferStock({
          id: data.transferStock.id,
          from: transferFrom,
          to: transferTo,
          qty: parseInt(transferQty)
        }));
        alert(`Stock transferred: ${transferQty} units from ${transferFrom} to ${transferTo}`);
        setTransferQty("");
        setTransferTo("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to transfer stock");
    } finally {
      dispatch(setDrawerOpen(false))
    }
  }
};

  React.useEffect(() => {
    if (selectedProduct) {
      setNewDemand(selectedProduct.demand.toString());
      setTransferFrom(selectedProduct.warehouse);
      setTransferQty('');
      setTransferTo('');
    }
  }, [selectedProduct]);

  const handleClose = () => {
    dispatch(setDrawerOpen(false));
  };

  const getWarehouseName = (code: string) => {
    const warehouse = warehouses.find(w => w.code === code);
    return warehouse ? warehouse.name : code;
  };

  if (!selectedProduct) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform z-50 ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Information
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedProduct.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">SKU</label>
                    <p className="font-mono text-gray-900">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID</label>
                    <p className="font-mono text-gray-900">{selectedProduct.id}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Warehouse
                  </label>
                  <p className="text-gray-900">{getWarehouseName(selectedProduct.warehouse)} ({selectedProduct.warehouse})</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current Stock</label>
                    <p className="text-2xl font-bold text-blue-600">{selectedProduct.stock.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Demand</label>
                    <p className="text-2xl font-bold text-emerald-600">{selectedProduct.demand.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className={`flex items-center gap-2 text-lg font-medium ${getStatusColor(selectedProduct.status)}`}>
                    <span>{getStatusIcon(selectedProduct.status)}</span>
                    <span className="capitalize">{selectedProduct.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Update Demand
              </h3>
              
              <form onSubmit={handleUpdateDemand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Demand Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newDemand}
                    onChange={(e) => setNewDemand(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new demand"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Update Demand
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Transfer Stock
              </h3>
              
              <form onSubmit={handleTransferStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Transfer
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.stock}
                    value={transferQty}
                    onChange={(e) => setTransferQty(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Warehouse
                    </label>
                    <select
                      value={transferFrom}
                      onChange={(e) => setTransferFrom(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.code} value={warehouse.code}>
                          {warehouse.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Warehouse
                    </label>
                    <select
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select warehouse</option>
                      {warehouses
                        .filter(w => w.code !== transferFrom)
                        .map((warehouse) => (
                        <option key={warehouse.code} value={warehouse.code}>
                          {warehouse.code} - {warehouse.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!transferQty || !transferTo}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Transfer Stock
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDrawer;