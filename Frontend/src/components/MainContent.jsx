import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  Clock,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive
} from 'lucide-react';

const MainContent = () => {
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy notes data
  const notes = [
    {
      id: 1,
      title: "Meeting Notes - Project Alpha",
      content: "Discuss timeline, budget, and resource allocation for Q3...",
      date: "2024-01-15",
      tags: ["work", "meeting"],
      color: "bg-blue-50",
      isStarred: true
    },
    {
      id: 2,
      title: "React Best Practices 2024",
      content: "Hooks, Context API, Performance optimization techniques...",
      date: "2024-01-14",
      tags: ["coding", "react"],
      color: "bg-purple-50",
      isStarred: false
    },
    {
      id: 3,
      title: "Grocery Shopping List",
      content: "Milk, Eggs, Bread, Vegetables, Fruits, Snacks...",
      date: "2024-01-13",
      tags: ["personal"],
      color: "bg-green-50",
      isStarred: false
    },
    {
      id: 4,
      title: "Workout Plan",
      content: "Monday: Chest & Triceps, Tuesday: Back & Biceps...",
      date: "2024-01-12",
      tags: ["fitness"],
      color: "bg-orange-50",
      isStarred: true
    },
    {
      id: 5,
      title: "Book Recommendations",
      content: "Atomic Habits, Deep Work, The Pragmatic Programmer...",
      date: "2024-01-11",
      tags: ["reading"],
      color: "bg-pink-50",
      isStarred: false
    },
    {
      id: 6,
      title: "Travel Itinerary - Dubai",
      content: "Day 1: Burj Khalifa, Day 2: Desert Safari, Day 3: Dubai Mall...",
      date: "2024-01-10",
      tags: ["travel"],
      color: "bg-yellow-50",
      isStarred: false
    }
  ];

  // Quick stats
  const stats = [
    { label: 'Total Notes', value: '24', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Starred', value: '8', icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { label: 'Tags', value: '12', icon: Tag, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'This Week', value: '5', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">Manage and organize all your notes in one place</p>
          </div>
          
          {/* Create Note Button */}
          <button className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
            <Plus size={20} />
            <span className="font-medium">Create New Note</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter and View Toggle */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} className="text-gray-600" />
                <span className="text-gray-700">Filter</span>
              </button>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid/List View */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {notes.map((note) => (
            <div
              key={note.id}
              className={`
                group relative ${note.color} rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-200 border border-gray-200 overflow-hidden
                ${viewMode === 'list' ? 'flex items-start p-4' : 'p-5'}
              `}
            >
              {/* Star Icon */}
              <button className={`absolute top-3 right-3 ${note.isStarred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors`}>
                <Star size={18} fill={note.isStarred ? 'currentColor' : 'none'} />
              </button>

              {/* Note Content */}
              <div className={viewMode === 'list' ? 'flex-1 pr-8' : ''}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-6">{note.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{note.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {note.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-white/50 backdrop-blur-sm text-xs rounded-full text-gray-600 border border-gray-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>{new Date(note.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>

              {/* Actions Menu (appears on hover) */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600 hover:text-emerald-600">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                  <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-600 hover:text-blue-600">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no notes) */}
        {notes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-6">Create your first note to get started</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus size={20} />
              Create Your First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;