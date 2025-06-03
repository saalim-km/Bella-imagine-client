import { CommunityForm } from '@/components/admin/community_contest/CreateCommunity'
import { AdminLayout } from '@/components/layout/AdminLayout'
import React from 'react'

const CreateCommunityPage = () => {
  return (
    <AdminLayout>
        <CommunityForm/>
    </AdminLayout>
  )
}

export default CreateCommunityPage