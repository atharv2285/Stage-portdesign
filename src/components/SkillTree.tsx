import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Code2, Brain, Server, TrendingUp, X, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface SkillNodeData {
  label: string;
  completed: boolean;
  projects?: string[];
  courses?: string[];
  notes?: string;
  category: string;
}

const SkillNode = ({ data, selected }: { data: SkillNodeData; selected: boolean }) => {
  const completionPercentage = data.completed ? 100 : 0;
  
  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 transition-all min-w-[140px] ${
        data.completed
          ? "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400"
          : "bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400"
      } ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="font-medium text-sm text-center mb-1">{data.label}</div>
      <div className="w-full h-1 bg-background/50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            data.completed ? "bg-blue-500" : "bg-purple-500"
          }`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

const nodeTypes = {
  skillNode: SkillNode,
};

interface CategoryTree {
  name: string;
  icon: typeof Code2;
  color: string;
  initialNodes: Node<SkillNodeData>[];
  initialEdges: Edge[];
  isCustom?: boolean;
}

const defaultCategoryTrees: Record<string, CategoryTree> = {
  webdev: {
    name: "Web Development",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    initialNodes: [
      {
        id: "1",
        type: "skillNode",
        position: { x: 250, y: 0 },
        data: {
          label: "HTML & CSS",
          completed: true,
          projects: ["Portfolio Website", "Landing Pages"],
          courses: ["HTML/CSS Fundamentals"],
          notes: "Foundation of web development. Master responsive design and flexbox/grid.",
          category: "webdev",
        },
      },
      {
        id: "2",
        type: "skillNode",
        position: { x: 100, y: 120 },
        data: {
          label: "JavaScript",
          completed: true,
          projects: ["Interactive Forms", "DOM Manipulation"],
          courses: ["JavaScript Essentials", "ES6+ Features"],
          notes: "Core language for web interactivity. Focus on async/await and modern features.",
          category: "webdev",
        },
      },
      {
        id: "3",
        type: "skillNode",
        position: { x: 400, y: 120 },
        data: {
          label: "TypeScript",
          completed: true,
          projects: ["API Services", "Full-stack Apps"],
          courses: ["TypeScript Deep Dive"],
          notes: "Type safety for JavaScript. Essential for large applications.",
          category: "webdev",
        },
      },
      {
        id: "4",
        type: "skillNode",
        position: { x: 0, y: 240 },
        data: {
          label: "React",
          completed: true,
          projects: ["E-commerce Platform", "Dashboard App"],
          courses: ["React Complete Guide"],
          notes: "Component-based UI library. Master hooks and state management.",
          category: "webdev",
        },
      },
      {
        id: "5",
        type: "skillNode",
        position: { x: 200, y: 240 },
        data: {
          label: "Vue",
          completed: false,
          courses: ["Vue.js Fundamentals"],
          notes: "Progressive framework. Good for incremental adoption.",
          category: "webdev",
        },
      },
      {
        id: "6",
        type: "skillNode",
        position: { x: 350, y: 240 },
        data: {
          label: "Next.js",
          completed: true,
          projects: ["Marketing Sites", "SaaS Products"],
          courses: ["Next.js 14 Course"],
          notes: "React framework with SSR and file-based routing.",
          category: "webdev",
        },
      },
    ],
    initialEdges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e2-4",
        source: "2",
        target: "4",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
    ],
  },
  aiml: {
    name: "AI & Machine Learning",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    initialNodes: [
      {
        id: "1",
        type: "skillNode",
        position: { x: 250, y: 0 },
        data: {
          label: "Python",
          completed: true,
          projects: ["Data Analysis", "Automation Scripts"],
          courses: ["Python for Beginners"],
          notes: "Essential language for ML. Master data structures and libraries.",
          category: "aiml",
        },
      },
      {
        id: "2",
        type: "skillNode",
        position: { x: 100, y: 120 },
        data: {
          label: "ML Basics",
          completed: true,
          projects: ["Prediction Models"],
          courses: ["Machine Learning A-Z"],
          notes: "Understand algorithms, supervised/unsupervised learning.",
          category: "aiml",
        },
      },
      {
        id: "3",
        type: "skillNode",
        position: { x: 400, y: 120 },
        data: {
          label: "LLMs",
          completed: true,
          projects: ["Chatbots", "AI Assistants"],
          courses: ["LLM Bootcamp"],
          notes: "Large language models and prompt engineering.",
          category: "aiml",
        },
      },
      {
        id: "4",
        type: "skillNode",
        position: { x: 0, y: 240 },
        data: {
          label: "TensorFlow",
          completed: true,
          projects: ["Image Classification"],
          courses: ["TensorFlow Developer Certificate"],
          notes: "Deep learning framework by Google.",
          category: "aiml",
        },
      },
      {
        id: "5",
        type: "skillNode",
        position: { x: 200, y: 240 },
        data: {
          label: "PyTorch",
          completed: false,
          courses: ["PyTorch for Deep Learning"],
          notes: "Research-focused deep learning library.",
          category: "aiml",
        },
      },
      {
        id: "6",
        type: "skillNode",
        position: { x: 350, y: 240 },
        data: {
          label: "OpenAI APIs",
          completed: true,
          projects: ["Content Generator", "Code Assistant"],
          courses: ["OpenAI API Masterclass"],
          notes: "GPT models integration and API usage.",
          category: "aiml",
        },
      },
    ],
    initialEdges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e2-4",
        source: "2",
        target: "4",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
    ],
  },
  backend: {
    name: "Backend",
    icon: Server,
    color: "from-green-500 to-emerald-500",
    initialNodes: [
      {
        id: "1",
        type: "skillNode",
        position: { x: 250, y: 0 },
        data: {
          label: "Node.js",
          completed: true,
          projects: ["REST APIs", "Microservices"],
          courses: ["Node.js Complete Guide"],
          notes: "JavaScript runtime for server-side development.",
          category: "backend",
        },
      },
      {
        id: "2",
        type: "skillNode",
        position: { x: 100, y: 120 },
        data: {
          label: "Express",
          completed: true,
          projects: ["API Server", "Auth Service"],
          courses: ["Express.js Tutorial"],
          notes: "Minimalist web framework for Node.js.",
          category: "backend",
        },
      },
      {
        id: "3",
        type: "skillNode",
        position: { x: 400, y: 120 },
        data: {
          label: "Databases",
          completed: true,
          projects: ["User Management", "Analytics DB"],
          courses: ["Database Design"],
          notes: "Data persistence and management.",
          category: "backend",
        },
      },
      {
        id: "4",
        type: "skillNode",
        position: { x: 300, y: 240 },
        data: {
          label: "PostgreSQL",
          completed: true,
          projects: ["Multi-tenant SaaS"],
          courses: ["PostgreSQL Bootcamp"],
          notes: "Powerful relational database.",
          category: "backend",
        },
      },
      {
        id: "5",
        type: "skillNode",
        position: { x: 500, y: 240 },
        data: {
          label: "MongoDB",
          completed: true,
          projects: ["Social Media App"],
          courses: ["MongoDB University"],
          notes: "NoSQL document database.",
          category: "backend",
        },
      },
    ],
    initialEdges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
    ],
  },
  finance: {
    name: "Finance",
    icon: TrendingUp,
    color: "from-yellow-500 to-orange-500",
    initialNodes: [
      {
        id: "1",
        type: "skillNode",
        position: { x: 250, y: 0 },
        data: {
          label: "Fintech Basics",
          completed: true,
          projects: ["Payment Gateway"],
          courses: ["Fintech Fundamentals"],
          notes: "Understanding financial technology ecosystem.",
          category: "finance",
        },
      },
      {
        id: "2",
        type: "skillNode",
        position: { x: 50, y: 120 },
        data: {
          label: "Payment APIs",
          completed: true,
          projects: ["Stripe Integration", "PayPal Checkout"],
          courses: ["Payment Systems Course"],
          notes: "Integration with payment processors.",
          category: "finance",
        },
      },
      {
        id: "3",
        type: "skillNode",
        position: { x: 250, y: 120 },
        data: {
          label: "Blockchain",
          completed: false,
          courses: ["Blockchain Basics"],
          notes: "Distributed ledger technology.",
          category: "finance",
        },
      },
      {
        id: "4",
        type: "skillNode",
        position: { x: 450, y: 120 },
        data: {
          label: "Trading Systems",
          completed: false,
          courses: ["Algorithmic Trading"],
          notes: "Automated trading strategies.",
          category: "finance",
        },
      },
    ],
    initialEdges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
      {
        id: "e1-4",
        source: "1",
        target: "4",
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
      },
    ],
  },
};

export const SkillTree = () => {
  const [categoryTrees, setCategoryTrees] = useState<Record<string, CategoryTree>>(defaultCategoryTrees);
  const [selectedCategory, setSelectedCategory] = useState<string>("webdev");
  const [selectedNode, setSelectedNode] = useState<Node<SkillNodeData> | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const currentTree = categoryTrees[selectedCategory];
  const [nodes, setNodes, onNodesChange] = useNodesState(currentTree.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentTree.initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: "smoothstep",
      animated: false,
      style: { stroke: "hsl(var(--border))", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--border))" },
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<SkillNodeData>) => {
    setSelectedNode(node);
    setIsDetailOpen(true);
  }, []);

  const handleCategoryChange = (category: string) => {
    setCategoryTrees((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        initialNodes: nodes,
        initialEdges: edges,
      },
    }));
    
    setSelectedCategory(category);
    const tree = categoryTrees[category];
    setNodes(tree.initialNodes);
    setEdges(tree.initialEdges);
    setIsDetailOpen(false);
  };

  const handleToggleCompletion = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, completed: !node.data.completed } }
          : node
      )
    );
    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, completed: !selectedNode.data.completed },
    });
  };

  const handleUpdateNotes = (notes: string) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, notes } } : node
      )
    );
    setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, notes } });
  };

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    
    const newNode: Node<SkillNodeData> = {
      id: `${Date.now()}`,
      type: "skillNode",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 50 },
      data: {
        label: newNodeLabel,
        completed: false,
        category: selectedCategory,
        notes: "",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewNodeLabel("");
    setIsAddNodeOpen(false);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setIsDetailOpen(false);
    setSelectedNode(null);
  };

  const handleEditNodeLabel = (newLabel: string) => {
    if (!selectedNode || !newLabel.trim()) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
    setSelectedNode({
      ...selectedNode,
      data: { ...selectedNode.data, label: newLabel },
    });
    setIsEditNodeOpen(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategory: CategoryTree = {
      name: newCategoryName,
      icon: Code2,
      color: "from-indigo-500 to-violet-500",
      initialNodes: [
        {
          id: "1",
          type: "skillNode",
          position: { x: 250, y: 100 },
          data: {
            label: "Start Here",
            completed: false,
            category: categoryId,
            notes: "Add your first skill!",
          },
        },
      ],
      initialEdges: [],
      isCustom: true,
    };

    setCategoryTrees((prev) => {
      const updated = { ...prev, [categoryId]: newCategory };
      setTimeout(() => {
        setSelectedCategory(categoryId);
        setNodes(newCategory.initialNodes);
        setEdges(newCategory.initialEdges);
        setIsDetailOpen(false);
      }, 0);
      return updated;
    });
    setNewCategoryName("");
    setIsAddCategoryOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!currentTree.isCustom) return;
    
    const newTrees = { ...categoryTrees };
    delete newTrees[selectedCategory];
    setCategoryTrees(newTrees);
    setSelectedCategory("webdev");
    const tree = newTrees["webdev"];
    setNodes(tree.initialNodes);
    setEdges(tree.initialEdges);
    setIsDetailOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Interactive Skill Trees</h2>
        
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Custom Tree
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Skill Tree</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Mobile Development, DevOps"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCategory}>Create Tree</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(categoryTrees).map(([key, cat]) => {
          const Icon = cat.icon;
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              className="gap-2"
              onClick={() => handleCategoryChange(key)}
            >
              <Icon className="w-4 h-4" />
              {cat.name}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Skill Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="node-label">Skill Name</Label>
                <Input
                  id="node-label"
                  placeholder="e.g., Docker, GraphQL, Flutter"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNode()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNode}>Add Skill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {currentTree.isCustom && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={handleDeleteCategory}
          >
            <Trash2 className="w-4 h-4" />
            Delete This Tree
          </Button>
        )}
      </div>

      <div className="relative">
        <Card className="p-0 overflow-hidden" style={{ height: "600px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: false,
            }}
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          </ReactFlow>
        </Card>

        {isDetailOpen && selectedNode && (
          <Card className="absolute top-4 right-4 w-80 p-6 shadow-lg z-10 max-h-[560px] overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{selectedNode.data.label}</h3>
                  <Dialog open={isEditNodeOpen} onOpenChange={setIsEditNodeOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Skill Name</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="edit-label">Skill Name</Label>
                          <Input
                            id="edit-label"
                            defaultValue={selectedNode.data.label}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditNodeLabel((e.target as HTMLInputElement).value);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={(e) => {
                            const input = (e.target as HTMLElement)
                              .closest('.space-y-4')
                              ?.querySelector('input') as HTMLInputElement;
                            if (input) handleEditNodeLabel(input.value);
                          }}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedNode.data.completed ? "default" : "outline"}
                    onClick={handleToggleCompletion}
                  >
                    {selectedNode.data.completed ? "✓ Completed" : "Mark Complete"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteNode}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDetailOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {selectedNode.data.projects && selectedNode.data.projects.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Projects</h4>
                    <div className="space-y-1">
                      {selectedNode.data.projects.map((project, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs mr-1 mb-1">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.data.courses && selectedNode.data.courses.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Courses</h4>
                    <div className="space-y-1">
                      {selectedNode.data.courses.map((course, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mr-1 mb-1">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Notes</h4>
                  <Textarea
                    value={selectedNode.data.notes || ""}
                    onChange={(e) => handleUpdateNotes(e.target.value)}
                    placeholder="Add your notes, comments, or learning goals..."
                    className="min-h-[100px] text-sm"
                  />
                </div>
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/20" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-purple-500 bg-purple-500/20" />
          <span>In Progress</span>
        </div>
        <span className="text-xs">💡 Tip: Drag nodes to rearrange. Click nodes to view details. Connect nodes by dragging from edge to edge.</span>
      </div>
    </div>
  );
};
