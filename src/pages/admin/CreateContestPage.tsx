import ContestCreate from '@/components/admin/contest_&_community/CreateContest'
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