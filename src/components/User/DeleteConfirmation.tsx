// src/components/Profile/DeleteConfirmation.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { closeDeleteModal, deletePost } from '@/store/slices/profileSlice';

const DeleteConfirmation: React.FC = () => {
  const dispatch = useDispatch();
  const { deleteModal } = useSelector((state: RootState) => state.profile);
  
  const handleDelete = () => {
    if (deleteModal.postId) {
      dispatch(deletePost(deleteModal.postId));
      dispatch(closeDeleteModal());
    }
  };
  
  return (
    <Dialog open={deleteModal.isOpen} onOpenChange={() => dispatch(closeDeleteModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => dispatch(closeDeleteModal())}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;