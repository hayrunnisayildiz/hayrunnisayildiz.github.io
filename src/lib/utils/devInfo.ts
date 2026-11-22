// What the terminal prints for `cat about` and `cat interests`.
// Replace the sample values below with your own.

export interface Developer {
  name: string;
  about: string;
  code: string[];
  interests: string[];
  operatingSystems: string[];
  toolsUsed: string[];
  ides: string[];
}

export const developer: Developer = {
  name: "Hayrunnisa Yıldız",
  about:
    "Hi, I'm Hayrunnisa Yıldız. I work where data science meets the earth sciences: \nmy graduation thesis, MinerAI, compares machine learning and kriging for 3D gold \nresource modelling. I also build uncertainty-aware neural priors in Julia for \ndrillhole and geophysical data (SmartPrior, SmartPriorMT). Try `ls projects`.",
  code: ["Python", "Julia", "SQL", "TypeScript"],
  interests: [
    "Machine Learning & Uncertainty Quantification",
    "Geophysical Inversion (MT, Gravity)",
    "Geostatistics & Spatial Data",
    "3D Data Visualization",
    "Data Pipelines & Reproducible Research",
  ],
  operatingSystems: ["macOS", "Windows", "Linux"],
  toolsUsed: [
    "scikit-learn", "XGBoost", "LightGBM", "pandas", "NumPy",
    "Lux.jl", "Zygote", "PyKrige", "PyVista", "Plotly", "Matplotlib", "Git", "GitHub Actions", "pytest",
  ],
  ides: ["VS Code"],
};
