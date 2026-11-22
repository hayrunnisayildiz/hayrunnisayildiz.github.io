const techColors: Record<string, string> = {
    'Go': 'bg-blue-200 text-blue-800',
    'macOS': 'bg-gray-200 text-gray-800',
    'TouchID': 'bg-green-200 text-green-800',
    'Svelte': 'bg-orange-200 text-orange-800',
    'TypeScript': 'bg-blue-200 text-blue-800',
    'JavaScript': 'bg-yellow-200 text-yellow-800',
    'React': 'bg-cyan-200 text-cyan-800',
    'Vue': 'bg-emerald-200 text-emerald-800',
    'Node.js': 'bg-green-200 text-green-800',
    'Python': 'bg-blue-200 text-blue-800',
    'Java': 'bg-red-200 text-red-800',
    'C#': 'bg-purple-200 text-purple-800',
    'Ruby': 'bg-red-200 text-red-800',
    'PHP': 'bg-indigo-200 text-indigo-800',
    'HTML': 'bg-orange-200 text-orange-800',
    'CSS': 'bg-blue-200 text-blue-800',
    'SQL': 'bg-yellow-200 text-yellow-800',
    'MongoDB': 'bg-green-200 text-green-800',
    'Docker': 'bg-blue-200 text-blue-800',
    'Kubernetes': 'bg-blue-200 text-blue-800',
    'AWS': 'bg-yellow-200 text-yellow-800',
    'Azure': 'bg-blue-200 text-blue-800',
    'GCP': 'bg-red-200 text-red-800',
    'scikit-learn': 'bg-orange-200 text-orange-800',
    'XGBoost': 'bg-sky-200 text-sky-800',
    'LightGBM': 'bg-lime-200 text-lime-800',
    'Geostatistics': 'bg-amber-200 text-amber-800',
    'Julia': 'bg-purple-200 text-purple-800',
    'Lux.jl': 'bg-fuchsia-200 text-fuchsia-800',
    'Deep Learning': 'bg-rose-200 text-rose-800',
    'Geophysics': 'bg-teal-200 text-teal-800',
    'Inversion': 'bg-indigo-200 text-indigo-800',
  };
  
  const typeColors: Record<string, string> = {
    'library': 'bg-purple-200 text-purple-800',
    'application': 'bg-green-200 text-green-800',
    'framework': 'bg-blue-200 text-blue-800',
    'tool': 'bg-yellow-200 text-yellow-800',
    'thesis': 'bg-amber-200 text-amber-900',
    'research': 'bg-indigo-200 text-indigo-800',
  };
  
  export function getTagColor(tech: string): string {
    return techColors[tech] || 'bg-gray-200 text-gray-800';
  }
  
  export function getTypeColor(type: string): string {
    return typeColors[type.toLowerCase()] || 'bg-gray-200 text-gray-800';
  }