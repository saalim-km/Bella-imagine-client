import ContestCreate from '@/components/admin/community_contest/CreateContest'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import React from 'react'

const CreateContestPage = () => {
  return (
    <AdminLayout>
        <ContestCreate/>
    </AdminLayout>
  )
}

export default CreateContestPage