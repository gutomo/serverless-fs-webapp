import { useEffect, useState } from "react";
import {
  Alert,
  Authenticator,
  defaultDarkModeOverride,
  Heading,
  Image,
  Text,
  ThemeProvider,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import { StorageHelper } from "../common/helpers/storage-helper";
import { Mode } from "@cloudscape-design/global-styles";
import { StatusIndicator } from "@cloudscape-design/components";
import { APP_NAME } from "../common/constants";
import { Amplify, Auth } from "aws-amplify";
import config from '../config';
import App from "../app";
import "@aws-amplify/ui-react/styles.css";

export default function AppConfigured() {
  const { tokens } = useTheme();
  const [error, setError] = useState<boolean | null>(null);
  const [theme, setTheme] = useState(StorageHelper.getTheme());

  const components = {
    Header() {
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="Amplify logo"
            src="https://docs.amplify.aws/assets/logo-dark.svg"
          />
        </View>
      );
    },
    Footer() {
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved
          </Text>
        </View>
      );
    },
    SignIn: {
      Header: () => {
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            {APP_NAME}
          </Heading>
        );
      },
    },
  }  

  useEffect(() => {
    try {
      const amplifyConfig = {
        ...(true || config.userPoolId != null
          ? {
              Auth: {
                region: config.awsRegion,
                userPoolId: config.userPoolId,
                userPoolWebClientId: config.userPoolClientId,
              },
            }
          : {}),
        API: {
          endpoints: [
            {
              name: 'main',
              endpoint: config.apiEndpoint,
              custom_header: async () => {
                return { Authorization: `${(await Auth.currentSession())?.getAccessToken().getJwtToken()}` };
              },
            },
            {
              name: 'public',
              endpoint: config.apiEndpoint + '/public',
            },
          ],
        },
      };
      Amplify.configure(amplifyConfig);
    } catch (e) {
      console.error(e);
      setError(true);
    }        
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const newValue =
            document.documentElement.style.getPropertyValue(
              "--app-color-scheme"
            );

          const mode = newValue === "dark" ? Mode.Dark : Mode.Light;
          if (mode !== theme) {
            setTheme(mode);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  if (!config) {
    if (error) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert heading="Configuration error" variation="error">
            Error loading configuration from "
            <a href=".env" style={{ fontWeight: "600" }}>.env</a>
            "
          </Alert>
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusIndicator type="loading">Loading</StatusIndicator>
      </div>
    );
  }

  return (
    <ThemeProvider
      theme={{
        name: "default-theme",
        overrides: [defaultDarkModeOverride],
      }}
      colorMode={theme === Mode.Dark ? "dark" : "light"}
    >
      <Authenticator components={components}>
        <App />
      </Authenticator>
    </ThemeProvider>
  );
}
