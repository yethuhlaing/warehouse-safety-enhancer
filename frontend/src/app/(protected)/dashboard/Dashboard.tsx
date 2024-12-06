'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { v4 as uuidv4 } from 'uuid'
import * as WEBIFC from "web-ifc"
import * as OBC from "@thatopen/components"
import { FragmentsGroup } from "@thatopen/fragments"
import * as THREE from "three"
import { usePosition } from 'use-position'

export interface Item {
  id: string
  serialCode: string
  name: string
  manufacturer: string
  installationDate: string
  warranty: string
  comment: string
  location: string
  x: number
  y: number
  z: number
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
    comment: '', 
    location: '',
    x: 0, 
    y: 0, 
    z: 0
  })

  const { latitude, longitude, error } = usePosition()

  const containerRef = useRef<HTMLDivElement>(null)
  const componentsRef = useRef<OBC.Components | null>(null)
  const worldRef = useRef<OBC.World | null>(null)
  const fragmentIfcLoaderRef = useRef<OBC.IfcLoader | null>(null)
  const [loadedModel, setLoadedModel] = useState<FragmentsGroup | null>(null)
  const itemMarkersRef = useRef<{[key: string]: THREE.Mesh}>({})
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const initScene = useCallback(() => {
    if (!containerRef.current) return

    const components = new OBC.Components()
    componentsRef.current = components

    const worlds = components.get(OBC.Worlds)
    const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>()

    world.scene = new OBC.SimpleScene(components)
    world.renderer = new OBC.SimpleRenderer(components, containerRef.current)
    world.camera = new OBC.SimpleCamera(components)

    components.init()

    world.camera.controls.setLookAt(0, 50, 100, 0, 0, 0)
    world.scene.setup()

    const grids = components.get(OBC.Grids)
    const grid = grids.create(world)
    
    if (grid.three) {
      grid.three.position.y = -3
    }
    world.scene.three.background = null

    worldRef.current = world

    const ifcLoader = components.get(OBC.IfcLoader)
    fragmentIfcLoaderRef.current = ifcLoader

    return () => {
      components.dispose()
    }
  }, [])

  const setupIfcLoader = useCallback(async () => {
    const ifcLoader = fragmentIfcLoaderRef.current
    if (!ifcLoader) return

    try {
      await ifcLoader.setup()

      const excludedCats = [
        WEBIFC.IFCTENDONANCHOR,
        WEBIFC.IFCREINFORCINGELEMENT,
        WEBIFC.IFCREINFORCINGBAR,
      ]

      for (const cat of excludedCats) {
        ifcLoader.settings.excludedCategories.add(cat)
      }

      ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true
      console.log("IFC Loader has been setup")
    } catch (error) {
      console.error('Error setting up IFC loader:', error)
    }
  }, [])

  useEffect(() => {
    const cleanup = initScene()
    setupIfcLoader()

    return () => {
      cleanup?.()
    }
  }, [initScene, setupIfcLoader])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const world = worldRef.current
    const ifcLoader = fragmentIfcLoaderRef.current

    if (!file || !ifcLoader || !world) {
      console.error('Missing dependencies for file upload')
      return
    }

    try {
      if (loadedModel) {
        world.scene.three.remove(loadedModel)
      }

      Object.values(itemMarkersRef.current).forEach(marker => {
        world.scene.three.remove(marker)
      })
      itemMarkersRef.current = {}

      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      const model = await ifcLoader.load(buffer)
      world.scene.three.add(model)
      
      setLoadedModel(model)
      console.log("Model loaded successfully", model)

      items.forEach(addItemToViewer)

    } catch (error) {
      console.error('Error loading IFC file:', error)
      alert('Failed to load IFC file. Please check the file and try again.')
    }
  }

  const exportFragments = () => {
    if (!loadedModel) {
      alert('No model loaded to export')
      return
    }

    const components = componentsRef.current
    const fragments = components?.get(OBC.FragmentsManager)
    if (!fragments) return

    const data = fragments.export(loadedModel)
    
    const downloadFile = (blob: Blob, filename: string) => {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
    }

    downloadFile(new Blob([data]), `model.frag`)

    const properties = loadedModel.getLocalProperties()
    if (properties) {
      downloadFile(new Blob([JSON.stringify(properties)]), `model_properties.json`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({ ...prev, [name]: value }))
  }

  const convertToLocalCoordinates = (lat: number, lon: number) => {
    const scale = 8;
    const normalizedLon = (lon + 180) / 360;
    const normalizedLat = (lat + 90) / 180;
    const x = normalizedLon * scale;
    const z = normalizedLat * scale;
    const y = 0;
    return { x, y, z };
  }

  const focusCameraOnItem = useCallback((position: THREE.Vector3) => {
    const world = worldRef.current;
    if (!world) return;

    const camera = world.camera.controls;
    camera?.setLookAt(
      position.x + 5, position.y + 5, position.z + 5,
      position.x, position.y, position.z,
      true
    );
  }, []);

  const addItemToViewer = useCallback((item: Item) => {
    const world = worldRef.current;
    if (!world) return;

    let cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    let cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(item.x, item.y, item.z);

    world.scene.three.add(cube);
    itemMarkersRef.current[item.id] = cube;

    cube.userData = {
      item: item,
      onPointerEnter: () => {
        setHoveredItem(item);
      },
      onPointerLeave: () => {
        setHoveredItem(null);
      },
    };

    focusCameraOnItem(cube.position);
  }, [focusCameraOnItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newItem.name || !latitude || !longitude) {
      alert('Please provide item name and allow geolocation')
      return
    }

    if (error) {
      alert(`Geolocation error: ${error}`)
      return
    }

    const localCoords = convertToLocalCoordinates(latitude, longitude)

    const itemWithId: Item = {
      ...newItem,
      id: uuidv4(),
      x: localCoords.x,
      y: localCoords.y,
      z: localCoords.z,
      location: 'Custom Location'
    }

    setItems(prev => [...prev, itemWithId])
    addItemToViewer(itemWithId)

    setNewItem({
      id: '',
      serialCode: '',
      name: '',
      manufacturer: '',
      installationDate: '',
      warranty: '',
      comment: '',
      location: '',
      x: 0,
      y: 0,
      z: 0
    })
  }

  const handlePointerEvents = useCallback((event: MouseEvent) => {
    const world = worldRef.current;
    if (!world) return;

    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, world.camera.three);

    const intersects = raycaster.intersectObjects(Object.values(itemMarkersRef.current));

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (event.type === 'pointermove') {
        object.userData.onPointerEnter?.();
        setTooltipPosition({ x: event.clientX, y: event.clientY });
      }
    } else {
      setHoveredItem(null);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('pointermove', handlePointerEvents);

    return () => {
      container.removeEventListener('pointermove', handlePointerEvents);
    };
  }, [handlePointerEvents]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full p-2 space-x-4">
    <div className="w-full md:w-1/3">
      <Input 
        type="file" 
        accept=".ifc"
        onChange={handleFileUpload}
        className="flex-grow"
      />
      {loadedModel && (
        <Button onClick={exportFragments} variant="secondary" className='my-2 w-full'>
          Export Fragments
        </Button>
      )}
      <form className="space-y-2 mt-4" onSubmit={handleSubmit}>
        <Input
          id="name"
          placeholder='Name'
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          required
        />
        <Input
          id="serialCode"
          placeholder='Serial Code'
          name="serialCode"
          value={newItem.serialCode}
          onChange={handleInputChange}
          required
        />
        <Input
          id="manufacturer"
          placeholder='Manufacturer'
          name="manufacturer"
          value={newItem.manufacturer}
          onChange={handleInputChange}
        />
        <Input
          id="installationDate"
          placeholder="Installation Date"
          type="date"
          name='installationDate'
          value={newItem.installationDate}
          onChange={handleInputChange}
        />
        <Input
          id="warranty"
          placeholder="Warranty"
          name='warranty'
          value={newItem.warranty}
          onChange={handleInputChange}
        />
        <Input
          id="comment"
          name='comment'
          placeholder="Comment"
          value={newItem.comment}
          onChange={handleInputChange}
        />
        <Button className='w-full' type="submit" disabled={!latitude || !longitude || !!error}>Add Item at Current Location</Button>
      </form>
    </div>
    <div className="w-full h-full relative" ref={containerRef}>
      {hoveredItem && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              style={{
                position: 'absolute',
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                width: '1px',
                height: '1px',
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <strong>{hoveredItem.name}</strong><br />
              Serial: {hoveredItem.serialCode}<br />
              Manufacturer: {hoveredItem.manufacturer}<br />
              Installation: {hoveredItem.installationDate}<br />
              Warranty: {hoveredItem.warranty}<br />
              Comment: {hoveredItem.comment}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  </div>
  )
}

