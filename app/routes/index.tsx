import React, { useEffect, useState } from 'react';
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { Image, useColorMode, Box, Heading, AspectRatio, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Viewer, Animation } from 'photo-sphere-viewer'
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers"
import { CompassPlugin } from "photo-sphere-viewer/dist/plugins/compass"
import { VisibleRangePlugin } from "photo-sphere-viewer/dist/plugins/visible-range";
import { VirtualTourPlugin } from "photo-sphere-viewer/dist/plugins/virtual-tour";
import * as data from '~/data/data.json'
import photo_sphere_viewer from "photo-sphere-viewer/dist/photo-sphere-viewer.css"
import compass_style from "photo-sphere-viewer/dist/plugins/compass.css"
import marker_style from "photo-sphere-viewer/dist/plugins/markers.css"

export function links() {
  return [
    {
      rel: "stylesheet",
      href: photo_sphere_viewer
    },
    {
      rel: "stylesheet",
      href: compass_style
    },
    {
      rel: "stylesheet",
      href: marker_style
    }
  ];
}

export function CatchBoundary() {
  return (
    <Box bg='yellow.500'>
      <Heading as="h2">I caught some condition</Heading>
    </Box>
  )
}

export function ErrorBoundary() {
  return (
    <Box bg='red.400' color="white">
      <Heading as="h2">Something went wrong!</Heading>
    </Box>
  )
}

export let loader: LoaderFunction = async () => {
  return data
};

export default function Index() {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ markerData, setMarkerData ] = useState({name: '', detail: '', mapUrl: '', imageUrl: ''});
  const { colorMode } = useColorMode();
  const sphereElementRef: React.RefObject<any> = React.createRef()!;
  let nodes = useLoaderData();

  useEffect(() => {
    const spherePlayerInstance = new Viewer({
      container: sphereElementRef.current,
      loadingImg: 'images/loading.webp',
      fisheye: true,
      defaultZoomLvl: 0,
      minFov: 0,
      maxFov: 30,
      navbar: [
        'autorotate',
        'zoom',
        'caption',
        'fullscreen',
      ],
      plugins: [
        [
          VisibleRangePlugin,
          {
            latitudeRange: [-Math.PI / 9, Math.PI / 9], //Restrict range so you can't see the top of the pano
          },
        ],
        [
          CompassPlugin, 
          {
            hotspotColor: 'rgba(255, 0, 0, 1)',
          }
        ],
        [
          MarkersPlugin,
          {
            hideButton: false,
            listButton: false,
          },
        ],
        [
          VirtualTourPlugin, 
          {
            positionMode: VirtualTourPlugin.MODE_GPS,
            renderMode  : VirtualTourPlugin.MODE_3D,
            linksOnCompass: true,
            markerStyle: 
            {
              html     : null, // an SVG provided by the plugin
              image: 'images/gem.webp',
              width    : 300,
              height   : 600,
              scale    : [0.5, 2],
              anchor   : 'top center',
              className: 'psv-virtual-tour__marker',
              style : {
                color: 'rgba(0, 208, 255, 0.8)',
                transform: 'rotate(20deg)',
              },
            },
          }
        ],
      ],
    });

    var marker = spherePlayerInstance.getPlugin(MarkersPlugin)!;
    marker.on('select-marker', (e, m) => {
      
      if (typeof m.data !== 'undefined' && m.data.hasOwnProperty('detail') ) {
        let data = {
          name: m.id,
          detail: m.data['detail'],
          mapUrl: m.data['mapUrl'],
          imageUrl: m.data['imageUrl']
        }
        setMarkerData(data)
        onOpen()
      }
    });

    var virtualTour = spherePlayerInstance.getPlugin(VirtualTourPlugin)!;
    virtualTour.setNodes(nodes[colorMode])

    spherePlayerInstance.once('ready', intro)

    function intro() {
      // default far plane is too close to render fisheye=4
      // you can also skip this line and start with fisheye=2
      // spherePlayerInstance.renderer.camera.far *= 2;
      new Animation({
          properties: {
              lat: { start: Math.PI/2, end: Math.PI/2 },
              long: { start: Math.PI, end: Math.PI },
              zoom: { start: 100, end: 0 },
              fisheye: { start: 4, end: 0 },
          },
          duration: 2000,
          easing: 'inOutQuad',
          onTick: (properties) => {
            spherePlayerInstance.rotate({ longitude: properties.long, latitude: properties.lat });
            spherePlayerInstance.zoom(properties.zoom);
          }
      });
    }

    // unmount component instructions
    return () => {
      spherePlayerInstance.destroy()
    }
  }, [colorMode]); // will only be called when the src prop gets updated

  return (
    <>
      <Box ref={sphereElementRef} w='100%' h='100%'/>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{markerData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={5}>
            {
              markerData.imageUrl.length > 0 ? 
              <AspectRatio maxW='400px' ratio={16 / 9} mb={2}>
                <Image src={markerData.imageUrl} alt={markerData.name + '-img'} objectFit='cover' />
              </AspectRatio>
              : null
            }
            {markerData.detail}
            {
              markerData.mapUrl.length > 0 ?
              <AspectRatio ratio={16 / 9} mt={2} mb={4}>
                <iframe
                  src={markerData.mapUrl} 
                />
              </AspectRatio>
              : null
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
