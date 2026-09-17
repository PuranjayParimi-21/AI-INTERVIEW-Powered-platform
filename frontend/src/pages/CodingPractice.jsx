import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Code2, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  Clock, 
  Database,
  Terminal,
  Check,
  RotateCcw,
  Zap,
  HelpCircle,
  Search,
  Tag
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';

const DEFAULT_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    acceptance: "52.4%",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    sample_input: "nums = [2, 7, 11, 15], target = 9",
    sample_output: "[0, 1]",
    hint: "Use a Hash Map to store numbers and their indices for O(N) time complexity.",
    test_cases: [
      { id: 1, input: "nums = [2, 7, 11, 15], target = 9", expected_output: "[0, 1]", is_hidden: false },
      { id: 2, input: "nums = [3, 2, 4], target = 6", expected_output: "[1, 2]", is_hidden: false },
      { id: 3, input: "nums = [3, 3], target = 6", expected_output: "[0, 1]", is_hidden: true }
    ],
    stubs: {
      Python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []\n",
      JavaScript: "function twoSum(nums, target) {\n    // Write your solution here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n",
      "C++": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (mp.count(diff)) return {mp[diff], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};\n",
      Java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}\n"
    }
  },
  {
    id: 2,
    title: "Valid Anagram",
    category: "Arrays & Hashing",
    difficulty: "Easy",
    acceptance: "64.1%",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.",
    constraints: "1 <= s.length, t.length <= 5 * 10^4",
    sample_input: "s = \"anagram\", t = \"nagaram\"",
    sample_output: "true",
    hint: "Check character frequency counts or sort both strings.",
    test_cases: [
      { id: 1, input: "s = \"anagram\", t = \"nagaram\"", expected_output: "true", is_hidden: false },
      { id: 2, input: "s = \"rat\", t = \"car\"", expected_output: "false", is_hidden: false },
      { id: 3, input: "s = \"a\", t = \"ab\"", expected_output: "false", is_hidden: true }
    ],
    stubs: {
      Python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t): return False\n        return sorted(s) == sorted(t)\n",
      JavaScript: "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}\n",
      "C++": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        sort(s.begin(), s.end());\n        sort(t.begin(), t.end());\n        return s == t;\n    }\n};\n",
      Java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        char[] sArr = s.toCharArray();\n        char[] tArr = t.toCharArray();\n        Arrays.sort(sArr);\n        Arrays.sort(tArr);\n        return Arrays.equals(sArr, tArr);\n    }\n}\n"
    }
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window",
    difficulty: "Medium",
    acceptance: "34.8%",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4",
    sample_input: "s = \"abcabcbb\"",
    sample_output: "3",
    hint: "Use a sliding window with two pointers and a Hash Set to track unique characters.",
    test_cases: [
      { id: 1, input: "s = \"abcabcbb\"", expected_output: "3", is_hidden: false },
      { id: 2, input: "s = \"bbbbb\"", expected_output: "1", is_hidden: false },
      { id: 3, input: "s = \"pwwkew\"", expected_output: "3", is_hidden: true }
    ],
    stubs: {
      Python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_set = set()\n        l = 0\n        res = 0\n        for r in range(len(s)):\n            while s[r] in char_set:\n                char_set.remove(s[l])\n                l += 1\n            char_set.add(s[r])\n            res = max(res, r - l + 1)\n        return res\n",
      JavaScript: "function lengthOfLongestSubstring(s) {\n    let set = new Set();\n    let l = 0, res = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) {\n            set.delete(s[l]);\n            l++;\n        }\n        set.add(s[r]);\n        res = Math.max(res, r - l + 1);\n    }\n    return res;\n}\n",
      "C++": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> st;\n        int l = 0, res = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (st.count(s[r])) {\n                st.erase(s[l++]);\n            }\n            st.insert(s[r]);\n            res = max(res, r - l + 1);\n        }\n        return res;\n    }\n};\n",
      Java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int l = 0, res = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (set.contains(s.charAt(r))) {\n                set.remove(s.charAt(l++));\n            }\n            set.add(s.charAt(r));\n            res = Math.max(res, r - l + 1);\n        }\n        return res;\n    }\n}\n"
    }
  },
  {
    id: 4,
    title: "Container With Most Water",
    category: "Two Pointers",
    difficulty: "Medium",
    acceptance: "55.2%",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.",
    constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    sample_input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
    sample_output: "49",
    hint: "Use two pointers starting at left and right boundaries. Move the pointer pointing to the shorter line inward.",
    test_cases: [
      { id: 1, input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", expected_output: "49", is_hidden: false },
      { id: 2, input: "height = [1, 1]", expected_output: "1", is_hidden: false },
      { id: 3, input: "height = [4, 3, 2, 1, 4]", expected_output: "16", is_hidden: true }
    ],
    stubs: {
      Python: "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        l, r = 0, len(height) - 1\n        max_water = 0\n        while l < r:\n            area = (r - l) * min(height[l], height[r])\n            max_water = max(max_water, area)\n            if height[l] < height[r]:\n                l += 1\n            else:\n                r -= 1\n        return max_water\n",
      JavaScript: "function maxArea(height) {\n    let l = 0, r = height.length - 1;\n    let maxWater = 0;\n    while (l < r) {\n        let area = (r - l) * Math.min(height[l], height[r]);\n        maxWater = Math.max(maxWater, area);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxWater;\n}\n",
      "C++": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, maxWater = 0;\n        while (l < r) {\n            int area = (r - l) * min(height[l], height[r]);\n            maxWater = max(maxWater, area);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxWater;\n    }\n};\n",
      Java: "class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, maxWater = 0;\n        while (l < r) {\n            int area = (r - l) * Math.min(height[l], height[r]);\n            maxWater = Math.max(maxWater, area);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxWater;\n    }\n}\n"
    }
  }
];

const PRESET_TAGS = ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Dynamic Programming", "Trees & Graphs", "Binary Search"];

const CodingPractice = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(DEFAULT_PROBLEMS);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'testcases' | 'hint'

  const lineRef = useRef(null);

  const handleScroll = (e) => {
    if (lineRef.current) {
      lineRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } 
    else if (e.key === 'Enter') {
      e.preventDefault();
      const lines = code.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const leadingSpacesMatch = currentLine.match(/^ */);
      const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0] : '';
      
      let extraIndent = '';
      if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) {
        extraIndent = '    ';
      }

      const indentToUse = leadingSpaces + extraIndent;
      const newValue = code.substring(0, start) + '\n' + indentToUse + code.substring(end);
      setCode(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indentToUse.length;
      }, 0);
    }
    else {
      const pairs = { '{': '}', '[': ']', '(': ')', '"': '"', "'": "'", '`': '`' };
      if (pairs[e.key] !== undefined) {
        e.preventDefault();
        const closeChar = pairs[e.key];
        const newValue = code.substring(0, start) + e.key + closeChar + code.substring(end);
        setCode(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  const getCodeStub = (q, lang) => {
    if (q && q.stubs && q.stubs[lang]) {
      return q.stubs[lang];
    }
    const functionName = (q?.title || 'solve').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    if (lang === 'Python') return `class Solution:\n    def ${functionName}(self, input_data):\n        # Write your code here\n        pass\n`;
    if (lang === 'JavaScript') return `function ${functionName}(inputData) {\n    // Write your code here\n    return;\n}\n`;
    if (lang === 'Java') return `class Solution {\n    public void ${functionName}(int[] nums) {\n        // Write your solution here\n    }\n}\n`;
    return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (selectedQuestion) {
      setCode(getCodeStub(selectedQuestion, newLang));
    }
  };

  const handleOpenProblem = (q) => {
    setSelectedQuestion(q);
    setCode(getCodeStub(q, language));
    setEvaluation(null);
    setActiveTab('description');
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('difficulty', difficulty);

    try {
      const res = await API.post('/api/coding/generate', formData);
      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      }
    } catch (error) {
      console.error("Coding generation failed", error);
    }
    setLoading(false);
  };

  const handleSubmitSolution = async () => {
    if (!selectedQuestion) return;
    setEvaluating(true);
    setEvaluation(null);

    const formData = new FormData();
    formData.append('title', selectedQuestion.title);
    formData.append('description', selectedQuestion.description);
    formData.append('code', code);
    formData.append('language', language);

    try {
      const res = await API.post('/api/coding/evaluate', formData);
      setEvaluation(res.data);
    } catch (error) {
      console.error("Evaluation failed", error);
    }
    setEvaluating(false);
  };

  const getDiffBadge = (diff) => {
    if (diff === 'Easy') return 'badge-emerald';
    if (diff === 'Medium') return 'badge-amber';
    return 'badge-rose';
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        {/* LeetCode Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-emerald" style={{ alignSelf: 'flex-start', marginBottom: '6px' }}>
              <Sparkles size={14} /> LeetCode Practice Studio
            </span>
            <h1 className="page-title">LeetCode Code Judge Lab</h1>
            <p className="page-subtitle">Solve algorithmic problems, run test cases, and pass automated code submissions.</p>
          </div>

          {selectedQuestion && (
            <button 
              onClick={() => setSelectedQuestion(null)} 
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ChevronLeft size={16} /> Problem List
            </button>
          )}
        </div>
        
        {/* VIEW 1: PROBLEM EXPLORER LIST */}
        {!selectedQuestion ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Search & Filter Bar */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <form onSubmit={handleGenerate} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)} 
                    placeholder="Search by topic tag (e.g. Arrays, Dynamic Programming, Binary Search)..." 
                    style={{ paddingLeft: '40px' }}
                  />
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
                
                <div style={{ width: '160px' }}>
                  <select className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="Easy">Easy Level</option>
                    <option value="Medium">Medium Level</option>
                    <option value="Hard">Hard Level</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 24px' }}>
                  {loading ? <Sparkles className="pulse-dot" /> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Code2 size={16} /> Search Problems</span>}
                </button>
              </form>

              {/* Category Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Topics:
                </span>
                {PRESET_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(tag);
                      handleGenerate();
                    }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: topic === tag ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                      color: topic === tag ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* LeetCode Problem Cards Catalog Grid */}
            <div className="card-grid">
              {questions.map((q, i) => (
                <div key={i} className="dashboard-module-card" style={{ minHeight: '220px', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span className={`badge ${getDiffBadge(q.difficulty || difficulty)}`}>
                        {q.difficulty || difficulty}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                        Acceptance: {q.acceptance || '65%'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      {q.id || i + 1}. {q.title}
                    </h3>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
                      {q.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleOpenProblem(q)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '13px' }}
                  >
                    Solve Problem <Zap size={14} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* VIEW 2: LEETCODE CODE STUDIO (PROBLEM SPLIT VIEW) */
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* LeetCode Split Workspace */}
            <div className="dashboard-split-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
              
              {/* Left Column: Problem Details & Test Cases Panel */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`badge ${getDiffBadge(selectedQuestion.difficulty || difficulty)}`}>
                      {selectedQuestion.difficulty || difficulty}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
                      Acceptance: {selectedQuestion.acceptance || '65.2%'}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                    {selectedQuestion.title}
                  </h2>
                </div>

                {/* Sub-Navigation Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '16px', fontSize: '13px', fontWeight: '700' }}>
                  <button 
                    onClick={() => setActiveTab('description')}
                    style={{ background: 'none', border: 'none', borderBottom: activeTab === 'description' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '8px 4px', color: activeTab === 'description' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('testcases')}
                    style={{ background: 'none', border: 'none', borderBottom: activeTab === 'testcases' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '8px 4px', color: activeTab === 'testcases' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Test Cases ({selectedQuestion.test_cases ? selectedQuestion.test_cases.length : 3})
                  </button>
                  <button 
                    onClick={() => setActiveTab('hint')}
                    style={{ background: 'none', border: 'none', borderBottom: activeTab === 'hint' ? '2px solid var(--accent-primary)' : '2px solid transparent', padding: '8px 4px', color: activeTab === 'hint' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    💡 Hint
                  </button>
                </div>

                {/* TAB 1: Description */}
                {activeTab === 'description' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
                      {selectedQuestion.description}
                    </div>

                    {selectedQuestion.sample_input && (
                      <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                          EXAMPLE 1:
                        </span>
                        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '12px', background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '6px' }}>
                          <strong>Input:</strong> {selectedQuestion.sample_input}<br/>
                          <strong>Output:</strong> {selectedQuestion.sample_output}
                        </div>
                      </div>
                    )}

                    {selectedQuestion.constraints && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                          CONSTRAINTS:
                        </span>
                        <pre style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                          {selectedQuestion.constraints}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Test Cases */}
                {activeTab === 'testcases' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(selectedQuestion.test_cases || [
                      { id: 1, input: selectedQuestion.sample_input, expected_output: selectedQuestion.sample_output, is_hidden: false },
                      { id: 2, input: "Edge / Secondary Input", expected_output: "Expected Result 2", is_hidden: false },
                      { id: 3, input: "Hidden Boundary Case", expected_output: "Expected Result 3", is_hidden: true }
                    ]).map((tc, idx) => (
                      <div key={idx} style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                            Test Case #{tc.id || idx + 1}
                          </span>
                          <span className={`badge ${tc.is_hidden ? 'badge-purple' : 'badge-emerald'}`} style={{ fontSize: '10px' }}>
                            {tc.is_hidden ? 'Hidden Judge Case' : 'Sample Case'}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <div><strong>Input:</strong> {tc.input}</div>
                          <div><strong>Expected:</strong> {tc.expected_output}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: Hint */}
                {activeTab === 'hint' && (
                  <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '12px', borderLeft: '4px solid var(--accent-primary)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong>Algorithm Hint:</strong><br/>
                    {selectedQuestion.hint || "Think about using a Hash Map or Two Pointers to solve this in O(N) time."}
                  </div>
                )}

              </div>

              {/* Right Column: Code Editor & Automated Execution Judge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Dark Code Editor */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Code2 size={18} color="var(--accent-primary)" /> Code Editor
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <select 
                        className="input-field" 
                        value={language} 
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        style={{ width: '130px', padding: '6px 10px', fontSize: '12px' }}
                      >
                        <option value="Python">Python 3</option>
                        <option value="JavaScript">JavaScript ES6</option>
                        <option value="C++">C++ 17</option>
                        <option value="Java">Java 11</option>
                      </select>

                      <button 
                        onClick={() => setCode(getCodeStub(selectedQuestion, language))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Reset Code Template"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dark Code IDE Container */}
                  <div style={{ 
                    display: 'flex', 
                    background: '#0b0f19', 
                    borderRadius: '14px', 
                    border: '1px solid var(--border-color)', 
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '13px',
                    overflow: 'hidden'
                  }}>
                    {/* Line numbers column */}
                    <div 
                      ref={lineRef}
                      style={{ 
                        padding: '14px 0', 
                        width: '40px',
                        color: '#475569', 
                        textAlign: 'right', 
                        userSelect: 'none', 
                        background: '#070a12', 
                        borderRight: '1px solid #1e293b',
                        lineHeight: '20px',
                        overflow: 'hidden',
                        height: '340px'
                      }}
                    >
                      {Array.from({ length: Math.max(code.split('\n').length, 16) }).map((_, i) => (
                        <div key={i} style={{ paddingRight: '8px', height: '20px' }}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Textarea */}
                    <textarea
                      style={{ 
                        flex: 1,
                        background: 'transparent', 
                        color: '#f8fafc', 
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        padding: '14px',
                        lineHeight: '20px',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        height: '340px',
                        overflowY: 'auto'
                      }}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onScroll={handleScroll}
                      placeholder="Write your algorithm solution code here..."
                    ></textarea>
                  </div>

                  {/* Judge Controls */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button 
                      onClick={handleSubmitSolution}
                      className="btn-primary"
                      disabled={!code.trim() || evaluating}
                      style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '12px' }}
                    >
                      {evaluating ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles className="pulse-dot" /> Running LeetCode Judge...
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Play size={16} /> Submit & Pass All Test Cases
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* LEETCODE JUDGE EVALUATION MODAL / BANNER */}
                {evaluation && !evaluating && (
                  <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    {/* Official Verdict Header */}
                    <div style={{ 
                      padding: '16px 20px', 
                      borderRadius: '14px', 
                      background: evaluation.status === 'Accepted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)', 
                      border: `1px solid ${evaluation.status === 'Accepted' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {evaluation.status === 'Accepted' ? (
                          <CheckCircle2 size={26} color="var(--accent-emerald)" />
                        ) : (
                          <XCircle size={26} color="var(--accent-rose)" />
                        )}
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: evaluation.status === 'Accepted' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                            {evaluation.status === 'Accepted' ? '🎉 Accepted' : '❌ Wrong Answer'}
                          </h3>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Passed {evaluation.passed_test_cases || (evaluation.status === 'Accepted' ? 3 : 1)} / {evaluation.total_test_cases || 3} Test Cases
                          </span>
                        </div>
                      </div>

                      {evaluation.runtime && (
                        <div style={{ textAlign: 'right', fontSize: '12px' }}>
                          <span style={{ fontWeight: '800', display: 'block', color: 'var(--text-primary)' }}>Runtime: {evaluation.runtime}</span>
                          <span style={{ color: 'var(--text-muted)' }}>Memory: {evaluation.memory}</span>
                        </div>
                      )}
                    </div>

                    {/* Test Cases Results Table */}
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                        Test Cases Evaluation Breakdown:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(evaluation.test_results || [
                          { id: 1, input: "Test Case 1", expected: "Expected Result 1", actual: "Actual Result 1", passed: evaluation.status === 'Accepted', status: evaluation.status === 'Accepted' ? 'Passed' : 'Passed' },
                          { id: 2, input: "Test Case 2", expected: "Expected Result 2", actual: "Actual Result 2", passed: evaluation.status === 'Accepted', status: evaluation.status === 'Accepted' ? 'Passed' : 'Failed' },
                          { id: 3, input: "Test Case 3 (Hidden)", expected: "Expected Result 3", actual: "Actual Result 3", passed: evaluation.status === 'Accepted', status: evaluation.status === 'Accepted' ? 'Passed' : 'Failed' }
                        ]).map((tr, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              padding: '10px 14px', 
                              borderRadius: '10px', 
                              background: 'var(--bg-secondary)', 
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {tr.passed ? (
                                <Check size={16} color="var(--accent-emerald)" />
                              ) : (
                                <XCircle size={16} color="var(--accent-rose)" />
                              )}
                              <span style={{ fontWeight: '700' }}>Case {tr.id || idx + 1}: {tr.input || `Test Case ${idx + 1}`}</span>
                            </div>

                            <span className={`badge ${tr.passed ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '10px' }}>
                              {tr.passed ? 'Passed ✓' : 'Failed ❌'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Complexity Analysis */}
                    <div className="card-grid">
                      <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} color="var(--accent-primary)" /> TIME COMPLEXITY
                        </span>
                        <strong style={{ fontFamily: 'monospace', fontSize: '15px', display: 'block', marginTop: '4px' }}>
                          {evaluation.time_complexity || 'O(N)'}
                        </strong>
                      </div>
                      <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Database size={14} color="var(--accent-cyan)" /> SPACE COMPLEXITY
                        </span>
                        <strong style={{ fontFamily: 'monospace', fontSize: '15px', display: 'block', marginTop: '4px' }}>
                          {evaluation.space_complexity || 'O(1)'}
                        </strong>
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                      {evaluation.feedback}
                    </p>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default CodingPractice;
