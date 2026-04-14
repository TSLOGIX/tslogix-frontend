/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Text, LoaderSync } from "@/components";
import Pagination from "@/components/Pagination/Pagination";
import ProductRegisterComponent from "./components/product";
import { ProductService } from "../../api/maintenance.service";
import { MaintenanceStore } from "@/globalStore";

const Product: React.FC = () => {
  const { t } = useTranslation(['maintenance', 'common']);
  const { products, loaders } = MaintenanceStore();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<any>(null);

  const fetchFilteredProducts = useCallback(async (page: number, limit: number, search?: string) => {
    try {
      const filters: {
        name?: string;
        page: number;
        limit: number;
      } = { page, limit };

      if (search) filters.name = search;

      const result = await ProductService.fetchAllProducts(filters);

      if (result?.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchFilteredProducts(page, itemsPerPage, searchText);
  }, [fetchFilteredProducts, itemsPerPage, searchText]);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page
    fetchFilteredProducts(1, limit, searchText);
  }, [fetchFilteredProducts, searchText]);

  const handleSearch = useCallback((search: string) => {
    setSearchText(search);
    setCurrentPage(1); // Reset to first page
    fetchFilteredProducts(1, itemsPerPage, search);
  }, [fetchFilteredProducts, itemsPerPage]);

  useEffect(() => {
    fetchFilteredProducts(currentPage, itemsPerPage);
  }, []);

  useEffect(() => {
    ProductService.fetchProductFormFields();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Text size="3xl" weight="font-bold">
        {t('product')}
      </Text>
      <Divider />
      {loaders["products/fetch-form-fields"] ? (
        <div className="flex items-center justify-center flex-1">
          <LoaderSync />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden">
            <ProductRegisterComponent
              products={products}
              searchText={searchText}
              setSearchText={handleSearch}
              onRefresh={() => fetchFilteredProducts(currentPage, itemsPerPage, searchText)}
            />
          </div>
          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              totalItems={pagination.total_items}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}
      <Divider />
    </div>
  );
};

export default Product;
