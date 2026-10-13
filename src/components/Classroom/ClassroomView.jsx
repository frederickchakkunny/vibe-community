import React, { useState } from 'react'
import {
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  ExternalLink,
  BookOpen
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ClassroomView() {
  const {
    courses,
    user,
    toggleLessonComplete,
    activeCourseId,
    setActiveCourseId,
    activeLessonId,
    setActiveLessonId
  } = useApp()

  const [expandedModules, setExpandedModules] = useState({})

  // Find currently selected course & lesson
  const currentCourse = courses.find(c => c.id === activeCourseId)
  
  // Calculate total lessons & completed lessons for a course
  const getCourseProgress = (course) => {
    let totalLessons = 0
    let completedCount = 0

    course.modules?.forEach(mod => {
      mod.lessons?.forEach(les => {
        totalLessons++
        if (user.completedLessons.includes(les.id)) {
          completedCount++
        }
      })
    })

    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    return { totalLessons, completedCount, percent }
  }

  // Open a course
  const handleOpenCourse = (course) => {
    if (user.level < course.requiredLevel) return
    setActiveCourseId(course.id)
    
    // Default to first lesson if not set
    const firstLesson = course.modules?.[0]?.lessons?.[0]
    if (firstLesson) {
      setActiveLessonId(firstLesson.id)
    }
    
    // Auto-expand all modules
    const expanded = {}
    course.modules?.forEach(m => { expanded[m.id] = true })
    setExpandedModules(expanded)
  }

  // Find active lesson object
  let currentLesson = null
  if (currentCourse) {
    currentCourse.modules?.forEach(mod => {
      mod.lessons?.forEach(les => {
        if (les.id === (activeLessonId || currentCourse.modules[0]?.lessons[0]?.id)) {
          currentLesson = les
        }
      })
    })
  }

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* View 1: Course Grid (When no course is active) */}
      {!currentCourse ? (
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <GraduationCap className="w-7 h-7 text-amber-500" />
                <span>Classroom & Courses</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Step-by-step masterclasses. Complete lessons to earn +5 XP per lesson and level up.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Current Rank: <strong className="text-slate-900 dark:text-white">Level {user.level}</strong></span>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const { totalLessons, completedCount, percent } = getCourseProgress(course)
              const isLocked = user.level < course.requiredLevel

              return (
                <div
                  key={course.id}
                  className={`skool-card rounded-3xl overflow-hidden flex flex-col transition-all group ${
                    isLocked ? 'opacity-70' : 'hover:border-slate-300 dark:hover:border-white/25 hover:shadow-lg'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Level Lock Badge */}
                    <div className="absolute top-3 right-3">
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/40 shadow-lg">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlocks at Lvl {course.requiredLevel}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Progress & Action */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{completedCount} / {totalLessons} lessons</span>
                        </span>
                        <span className="font-mono text-amber-600 dark:text-amber-300 font-semibold">{percent}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleOpenCourse(course)}
                        disabled={isLocked}
                        className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          isLocked
                            ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/5'
                            : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-xs'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Locked (Reach Level {course.requiredLevel})</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 text-amber-500" />
                            <span>{completedCount > 0 ? 'Continue Course' : 'Start Course'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      ) : (
        /* View 2: Interactive Course Player */
        <div className="space-y-6">
          
          {/* Breadcrumb & Navigation Back */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveCourseId(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all courses</span>
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Course: <strong className="text-slate-900 dark:text-white">{currentCourse.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Modules & Lessons Syllabus Tree */}
            <div className="lg:col-span-1 space-y-4">
              <div className="skool-card rounded-3xl p-5 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Course Curriculum</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {getCourseProgress(currentCourse).completedCount} / {getCourseProgress(currentCourse).totalLessons} done
                  </span>
                </div>

                <div className="space-y-3">
                  {currentCourse.modules?.map((module) => {
                    const isExpanded = expandedModules[module.id] !== false

                    return (
                      <div key={module.id} className="rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden">
                        
                        {/* Module Header */}
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          <span className="truncate">{module.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {/* Lessons List */}
                        {isExpanded && (
                          <div className="p-2 pt-0 space-y-1">
                            {module.lessons?.map((lesson) => {
                              const isActive = (activeLessonId || currentCourse.modules[0]?.lessons[0]?.id) === lesson.id
                              const isCompleted = user.completedLessons.includes(lesson.id)

                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setActiveLessonId(lesson.id)}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all ${
                                    isActive
                                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate mr-2">
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                      <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className="truncate">{lesson.title}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                    {lesson.duration}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>

              </div>
            </div>

            {/* Right Column: Player & Lesson Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentLesson ? (
                <div className="space-y-6">
                  
                  {/* Video Player */}
                  <div className="rounded-3xl overflow-hidden bg-black border border-slate-200 dark:border-white/15 aspect-video shadow-xl relative">
                    {currentLesson.videoUrl ? (
                      <iframe
                        src={currentLesson.videoUrl}
                        title={currentLesson.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No video configured for this lesson.
                      </div>
                    )}
                  </div>

                  {/* Lesson Action Bar */}
                  <div className="skool-card rounded-3xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentLesson.title}</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{currentLesson.duration}</span>
                        </span>
                      </div>

                      {/* Mark Complete Button */}
                      <button
                        onClick={() => toggleLessonComplete(currentLesson.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          user.completedLessons.includes(currentLesson.id)
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                            : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-md shadow-rose-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {user.completedLessons.includes(currentLesson.id)
                            ? 'Completed (+5 XP earned)'
                            : 'Mark as Complete (+5 XP)'}
                        </span>
                      </button>
                    </div>

                    {/* Lesson Notes & Text Body */}
                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                      {currentLesson.content}
                    </div>

                    {/* Downloadable Resources */}
                    {currentLesson.resources && currentLesson.resources.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Lesson Resources
                        </h4>
                        <div className="space-y-1.5">
                          {currentLesson.resources.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-500" />
                                <span>{res.title}</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="skool-card rounded-3xl p-12 text-center text-slate-500 text-xs">
                  Please select a lesson from the curriculum on the left.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
