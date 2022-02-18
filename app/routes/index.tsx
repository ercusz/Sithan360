import React, { useEffect } from 'react';
import { Link, useLoaderData, useParams } from "remix";
import type { MetaFunction, LoaderFunction, ActionFunction } from "remix";
import { useColorMode, Box, Heading, AspectRatio, Container, Flex } from "@chakra-ui/react";
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

export const meta: MetaFunction = () => {
  return {
    title: 'Photo Viewer : Sithan360',
    description: 'Photos taken at Sithan',
  };
};

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
  
  const { colorMode } = useColorMode();
  const sphereElementRef: React.RefObject<any> = React.createRef()!;
  let nodes = useLoaderData();

  useEffect(() => {
    const spherePlayerInstance = new Viewer({
      container: sphereElementRef.current,
      loadingImg: 'https://i.pinimg.com/originals/25/5a/05/255a05ae61282c78be11f7a863f8e542.gif',
      fisheye: true,
      defaultZoomLvl: 0,
      minFov: 0,
      maxFov: 30,
      navbar: [
        'autorotate',
        'zoom',
        {
          id: 'my-button',
          content: `
          <button class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800">
            <span class="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Test button
            </span>
          </button>
          `,
          title: 'Hello world',
          className: 'custom-button',
          onClick: () => {
            alert('Hello from custom button');
          },
        },
        {
          id: 'my-button',
          content: `
                Test button
           
          `,
          title: 'Hello world',
          className: 'custom-button',
          onClick: () => {
            alert('Hello from custom button');
          },
        },
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
              image: 'https://i.pinimg.com/originals/f5/23/af/f523aff276f3624532b6f9bd805073a5.gif',
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

    var virtualTour = spherePlayerInstance.getPlugin(VirtualTourPlugin)!;
    virtualTour.setNodes(nodes[colorMode])
    console.log(nodes[colorMode])

    spherePlayerInstance.once('ready', intro)

    function intro() {
      // default far plane is too close to render fisheye=4
      // you can also skip this line and start with fisheye=2
      // spherePlayerInstance.renderer.camera.far *= 2;

      new Animation({
          properties: {
              lat: { start: 0, end: 0 },
              long: { start: 0, end: 0 },
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
    </>
  );
}
