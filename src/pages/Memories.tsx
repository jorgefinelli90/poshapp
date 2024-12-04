import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Heart, MessageCircle, Edit2, Trash2, Send } from 'lucide-react';
import { memoryService } from '../services/memoryService';
import { Memory as MemoryType } from '../types/Memory';
import { useAuthContext } from '../context/AuthContext';

const Memories = () => {
  const [memories, setMemories] = useState<MemoryType[]>([]);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [editingMemory, setEditingMemory] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const memoriesData = await memoryService.getMemories();
      setMemories(memoriesData);
    } catch (error) {
      console.error('Error loading memories:', error);
    }
  };

  const handleCreateMemory = async () => {
    if (!newMemoryText.trim() || !user) return;

    try {
      await memoryService.createMemory(newMemoryText, user.uid, user.displayName || 'Anonymous');
      setNewMemoryText('');
      loadMemories();
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const handleUpdateMemory = async (memoryId: string, text: string) => {
    try {
      await memoryService.updateMemory(memoryId, text);
      setEditingMemory(null);
      loadMemories();
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      await memoryService.deleteMemory(memoryId);
      loadMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleToggleLike = async (memoryId: string) => {
    if (!user) return;

    try {
      await memoryService.toggleLike(memoryId, user.uid);
      loadMemories();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (memoryId: string) => {
    if (!commentText.trim() || !user) return;

    try {
      await memoryService.addComment(memoryId, commentText, user.uid, user.displayName || 'Anonymous');
      setCommentText('');
      loadMemories();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <PageContainer title="Memories">
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full p-2 border rounded-lg resize-none"
            rows={3}
            placeholder="Share a memory..."
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
          />
          <Button onClick={handleCreateMemory} disabled={!newMemoryText.trim()}>
            Create New Memory
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {memories.map((memory) => (
          <Card key={memory.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{memory.authorName}</p>
                <p className="text-sm text-gray-500">
                  {memory.createdAt.toLocaleDateString()}
                </p>
              </div>
              {user && memory.authorId === user.uid && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMemory(memory.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(memory.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {editingMemory === memory.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full p-2 border rounded-lg resize-none"
                  defaultValue={memory.text}
                  rows={3}
                  onChange={(e) => setNewMemoryText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdateMemory(memory.id, newMemoryText)}>
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingMemory(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mb-4">{memory.text}</p>
            )}

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleToggleLike(memory.id)}
                className={`flex items-center gap-1 ${
                  user && memory.likes.includes(user.uid)
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                <Heart size={16} />
                <span>{memory.likes.length}</span>
              </button>
              <button
                onClick={() => setShowComments(showComments === memory.id ? null : memory.id)}
                className="flex items-center gap-1 text-gray-500"
              >
                <MessageCircle size={16} />
                <span>{memory.comments.length}</span>
              </button>
            </div>

            {showComments === memory.id && (
              <div className="mt-4">
                <div className="mb-4">
                  {memory.comments.map((comment) => (
                    <div key={comment.id} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">{comment.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    onClick={() => handleAddComment(memory.id)}
                    disabled={!commentText.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default Memories;