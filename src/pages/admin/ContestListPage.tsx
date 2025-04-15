import ContestList from '@/components/admin/community_contest/ContestList'
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