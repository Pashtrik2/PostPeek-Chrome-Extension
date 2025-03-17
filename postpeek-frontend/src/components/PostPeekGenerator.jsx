import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PostPeekGenerator() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState({ linkedin: "", instagram: "", twitter: "" });
  const [selectedTab, setSelectedTab] = useState("linkedin");
  const [premiumLocked, setPremiumLocked] = useState(true);

  const generatePosts = async () => {
    if (!idea) return;
    setLoading(true);
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea })
    });
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto mt-4 p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">PostPeek AI Content Generator</h2>
        <p className="text-sm mb-3">Let AI write a post for you based on a short idea.</p>
        <Textarea
          placeholder="Write a content about new project"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <Button className="w-full mt-3" onClick={generatePosts} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>

        {posts.linkedin && (
          <>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
              <TabsList>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="twitter">X.com</TabsTrigger>
                <TabsTrigger value="instagram">Instagram</TabsTrigger>
              </TabsList>

              <TabsContent value="linkedin">
                <Textarea readOnly value={posts.linkedin} className="mt-2" />
              </TabsContent>

              <TabsContent value="twitter">
                {premiumLocked ? (
                  <div className="text-center mt-3">
                    <Button variant="outline" className="w-full">UNLOCK FULL PLATFORM</Button>
                  </div>
                ) : (
                  <Textarea readOnly value={posts.twitter} className="mt-2" />
                )}
              </TabsContent>

              <TabsContent value="instagram">
                {premiumLocked ? (
                  <div className="text-center mt-3">
                    <Button variant="outline" className="w-full">UNLOCK FULL PLATFORM</Button>
                  </div>
                ) : (
                  <Textarea readOnly value={posts.instagram} className="mt-2" />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}