'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, User, Upload, X, Plus, Check } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AddStaffProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    skills: [] as string[],
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.includes('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      
      setProfileImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.position || !formData.bio || formData.skills.length === 0) {
      setError("Please fill in all required fields and add at least one skill.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for file upload
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("position", formData.position);
      submitFormData.append("bio", formData.bio);
      
      // Append each skill
      formData.skills.forEach((skill, index) => {
        submitFormData.append(`skills[${index}]`, skill);
      });
      
      // Append profile image if exists
      if (profileImage) {
        submitFormData.append("profile_image", profileImage);
      }
      
      await api.post('/provider/staff', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        position: "",
        bio: "",
        skills: [],
      });
      setProfileImage(null);
      setImagePreview(null);
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/provider');
      }, 2000);
    } catch (err: unknown) {
      console.error('Failed to create staff profile:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response && 
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? (err.response.data.message as string) 
        : "Failed to create staff profile. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-md mt-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Staff Profile Created!</h2>
                <p className="text-muted-foreground">
                  The staff profile has been created successfully and is now pending approval from administrators.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/provider">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Add Staff Profile</CardTitle>
                <CardDescription>
                  Create a new staff profile to showcase your team
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleTextChange}
                  placeholder="e.g., Senior Cleaner, Head Gardener"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleTextChange}
                  placeholder="Write a brief description about this staff member's experience and expertise"
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., Deep Cleaning, Garden Design"
                    className="rounded-r-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Profile Image (Optional)</Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop an image or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or JPEG (max. 2MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 w-full">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Staff profiles will be reviewed by administrators before they become visible to clients.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/provider')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Profile"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}