'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Color } from 'three'
import { v4 as uuidv4 } from 'uuid'
import * as WEBIFC from "web-ifc"
import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components"
import { FragmentsGroup } from "@thatopen/fragments"

export interface Item {
  id: string
  serialCode: string
  name: string
  manufacturer: string
  installationDate: string
  warranty: string
  maintenanceSchedule: string
  x: number
  y: number
  z: number
}

export interface BIMViewerProps {
  initialItems?: Item[]
}
export default function BIMViewer() {
  const [items, setItems] = useState<Item[]>([])
  const [newItem, setNewItem] = useState<Item>({
    id: '',
    serialCode: '',
    name: '',
    manufacturer: '',
    installationDate: '',
    warranty: '',
    maintenanceSchedule: '',
    x: 0,
    y: 0,
    z: 0
  })
  const containerRef = useRef<HTMLDivElement>(null);
  const [components, setComponents] = useState<OBC.Components | null>(null);
  const [world, setWorld] = useState<OBC.World | null>(null);
  const [fragmentIfcLoader, setFragmentIfcLoader] = useState<OBC.IfcLoader | null>();
  const [loadedModel, setLoadedModel] = useState<FragmentsGroup | null>(null);

  // Initialize 3D scene
  useEffect(() => {
    const initScene = () => {
      if (!containerRef.current) return;

      // Create components and world
      const newComponents = new OBC.Components();
      setComponents(newComponents);

      const worlds = newComponents.get(OBC.Worlds);
      const newWorld = worlds.create<
        OBC.SimpleScene,
        OBC.SimpleCamera,
        OBC.SimpleRenderer
      >();

      newWorld.scene = new OBC.SimpleScene(newComponents);
      newWorld.renderer = new OBC.SimpleRenderer(newComponents, containerRef.current);
      newWorld.camera = new OBC.SimpleCamera(newComponents);

      newComponents.init();

      // Configure camera and scene
      newWorld.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
      newWorld.scene.setup();

      // Make background transparent
      newWorld.scene.three.background = null;

      // Create grids
      const grids = newComponents.get(OBC.Grids);
      grids.create(newWorld);

      setWorld(newWorld);

      // Setup IFC loader
      const ifcLoader = newComponents.get(OBC.IfcLoader);
      setFragmentIfcLoader(ifcLoader);
    };

    initScene();
  }, []);

  // Setup IFC loader 
  useEffect(() => {
    const setupIfcLoader = async () => {
      if (!fragmentIfcLoader) return;

      try {
        await fragmentIfcLoader.setup();

        // Exclude certain categories
        const excludedCats = [
          WEBIFC.IFCTENDONANCHOR,
          WEBIFC.IFCREINFORCINGBAR,
          WEBIFC.IFCREINFORCINGELEMENT,
        ];

        for (const cat of excludedCats) {
          fragmentIfcLoader.settings.excludedCategories.add(cat);
        }

        // Configure coordinate system
        fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        console.log("IFC Loader has been setup")
      } catch (error) {
        console.error('Error setting up IFC loader:', error);
      }
    };

    setupIfcLoader();
  }, [fragmentIfcLoader]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fragmentIfcLoader || !world) return;
    console.log("IFC FIle", file)

    try {
      // Remove previous model if exists
      if (loadedModel) {
        world.scene.three.remove(loadedModel);
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Load IFC file
      const model = await fragmentIfcLoader.load(buffer);
      world.scene.three.add(model);
      
      // Update state
      setLoadedModel(model);
      console.log("Model", model)


    } catch (error) {
      console.error('Error loading IFC file:', error);
      alert('Failed to load IFC file. Please check the file and try again.');
    }
  };

  // Export loaded fragments
  const exportFragments = () => {
    if (!loadedModel) {
      alert('No model loaded to export');
      return;
    }

    const fragments = components?.get(OBC.FragmentsManager);
    if (!fragments) return;

    const data = fragments.export(loadedModel);
    
    // Download fragment file
    const downloadFile = (blob: Blob, filename: string) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    downloadFile(new Blob([data]), `sample.frag`);

    // Export properties if available
    const properties = loadedModel.getLocalProperties();
    if (properties) {
      downloadFile(new Blob([JSON.stringify(properties)]), `sample.json`);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({ ...prev, [name]: value }))
  }





  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (newItem.serialCode && newItem.name) {
  //     const itemWithId = { ...newItem, id: uuidv4() }
      
  //     // Get item location from IFC model
  //     if (viewerRef.current) {
  //       try {
  //         const result = await viewerRef.current.IFC.pickIfcItem(true)
  //         if (result) {
  //           const { modelID, id } = result
  //           const props = await viewerRef.current.IFC.getProperties(modelID, id, true)
  //           itemWithId.x = props.GlobalId.x
  //           itemWithId.y = props.GlobalId.y
  //           itemWithId.z = props.GlobalId.z
  //         }
  //       } catch (error) {
  //         console.error('Error picking IFC item:', error)
  //         setToast({ visible: true, message: 'Error picking IFC item', type: 'error' })
  //         return
  //       }
  //     }

  //     setItems(prev => [...prev, itemWithId])
  //     addItemToViewer(itemWithId)
  //     setNewItem({
  //       id: '',
  //       serialCode: '',
  //       name: '',
  //       manufacturer: '',
  //       installationDate: '',
  //       warranty: '',
  //       maintenanceSchedule: '',
  //       x: 0,
  //       y: 0,
  //       z: 0
  //     })
  //   }
  // }

  // const addItemToViewer = (item: Item) => {
  //   if (viewerRef.current) {
  //     const geometry = new THREE.SphereGeometry(0.5, 32, 32)
  //     const material = new THREE.MeshBasicMaterial({ color: new Color(0xff0000) })
  //     const sphere = new THREE.Mesh(geometry, material)
  //     sphere.position.set(item.x, item.y, item.z)
  //     viewerRef.current.context.scene.add(sphere)
  //     viewerRef.current.context.renderer.render(viewerRef.current.context.scene, viewerRef.current.context.camera)
  //   }
  // }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="p-4 bg-gray-100 flex space-x-4 items-center">
            <Input 
              type="file" 
              accept=".ifc"
              onChange={handleFileUpload}
            />
            {loadedModel && (
              <Input 
                onChange={exportFragments} 
                name="Export Fragments"
              />
            )}
          </div>
            <form className="space-y-4">
              <div>
                <Label htmlFor="serialCode">Serial Code</Label>
                <Input
                  id="serialCode"
                  name="serialCode"
                  value={newItem.serialCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={newItem.manufacturer}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="installationDate">Installation Date</Label>
                <Input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  value={newItem.installationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  name="warranty"
                  value={newItem.warranty}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="maintenanceSchedule">Maintenance Schedule</Label>
                <Input
                  id="maintenanceSchedule"
                  name="maintenanceSchedule"
                  value={newItem.maintenanceSchedule}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Item List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>{item.name} - {item.serialCode}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-2/3 h-full" ref={containerRef}></div>
    </div>
  )
}

