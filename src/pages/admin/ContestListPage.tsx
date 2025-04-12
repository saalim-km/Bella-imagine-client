import ContestList from '@/components/admin/contest_&_community/ContestList'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import React from 'react'

const ContestListPage = () => {
  return (
    <AdminLayout>
        <ContestList/>
    </AdminLayout>
  )
}

export default ContestListPage