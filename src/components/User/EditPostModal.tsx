// src/components/Profile/EditPostModal.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RootState } from '@/store/store';
import { closeEditModal, updatePost } from '@/store/slices/profileSlice';

const EditPostModal: React.FC = () => {
  const dispatch = useDispatch();
  const { editModal, posts } = useSelector((state: RootState) => state.profile);
  const post = posts.find(p => p.id === editModal.postId);
  
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal.postId) {
      dispatch(updatePost({
        id: editModal.postId,
        title,
        content,
      }));
      dispatch(closeEditModal());
    }
  };
  
  return (
    <Dialog open={editModal.isOpen} onOpenChange={() => dispatch(closeEditModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => dispatch(closeEditModal())}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;