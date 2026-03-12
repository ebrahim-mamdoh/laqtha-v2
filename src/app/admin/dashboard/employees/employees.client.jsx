"use client";

import { useState } from "react";
import { useEmployees } from "./useEmployees";
import EmployeesFilters from "./_components/EmployeesFilters.client";
import EmployeesTable from "./_components/EmployeesTable.server";
import styles from "./employees.module.css";

export default function EmployeesClient() {
    const { data: employees, isLoading, isError } = useEmployees();
    const [filters, setFilters] = useState({});

    if (isLoading) {
        return <div className={styles.centerContainer}>جاري تحميل بيانات الموظفين...</div>;
    }

    if (isError) {
        return <div className={styles.centerContainer}>حدث خطأ في تحميل البيانات</div>;
    }

    return (
        <div>
            <EmployeesFilters filters={filters} setFilters={setFilters} />
            <EmployeesTable employees={employees} />
        </div>
    );
}
