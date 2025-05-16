<template>
  <div v-if="stagesPerCase.length > 0">
    <div class="pipeline-wrapper">
      <div class="pipeline">
        <div
          v-for="(stage, index) in stagesPerCase"
          :key="index"
          class="stage-container"
        >
          <div
            :class="['stage-block', getStageClass(stage.status)]"
            :style="getClipPathStyle(index)"
          >
            <div class="stage-name">{{ stage.name }}</div>
            <template v-if="validateDate(stage.completed_at)">
              <div class="stage-date">{{ formatDate(stage.completed_at) }}</div>
            </template>
            <template v-else>
              <div class="stage-status">{{ getStatusLabel(stage.status) }}</div>
            </template>
          </div>
          <!-- Connector Arrow, not shown after last block -->
          <div
            v-if="index < stagesPerCase.length - 1"
            :class="['arrow-connector', getStageClass(stage.status)]"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="pipeline-wrapper">
      <div class="pipeline">
        <div class="stage-container">
          <div class="stage-block pending">
            <div class="stage-name">No stages available</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { getUserDateFormat } from "@processmaker/vue-form-elements";

export default {
  props: ["label", "event", "eventData"],
  data() {
    return {
      caseNumber: null,
      stagesPerCase: [],
      stagesStatus: {
        Done: "closed",
        "In Progress": "active",
        Pending: "pending"
      }
    };
  },
  mounted() {
    this.caseNumber = window.ProcessMaker?.caseNumber;
    this.getStageStatus(this.caseNumber);
  },
  methods: {
    getStageStatus(caseNumber) {
      if (!caseNumber) {
        console.error("Case number is not defined.");
        return;
      }
      ProcessMaker.apiClient
        .get(`cases/${caseNumber}/stages_bar`)
        .then((response) => {
          this.stagesPerCase = response.data.stages_per_case;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    validateDate(date) {
      return date && date !== "null";
    },
    getStageClass(status) {
      return this.stagesStatus[status] || "pending";
    },
    getStatusLabel(status) {
      if (status === "Done") return "Completed";
      return status || "Pending";
    },
    formatDate(date) {
      if (!date || date === "null") return "";
      return moment
        .utc(date, [getUserDateFormat(), moment.ISO_8601], true)
        .toISOString()
        .split(RegExp("T[0-9]"))[0];
    },
    getClipPathStyle(index) {
      if (index === 0) {
        return {
          clipPath: "none"
        };
      }
      if (this.stagesPerCase.length > 1) {
        return {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0px 100%, 20px 50%)"
        };
      }
      return {
        clipPath: "none"
      };
    }
  }
};
</script>
<style scoped>
.pipeline-wrapper {
  width: 100%;
  overflow-x: hidden;
  padding: 10px;
}
.pipeline {
  display: flex;
  align-items: stretch;
  width: 100%;
}
.stage-container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: -10px;
  align-self: stretch;
}

.stage-block {
  flex: 1;
  height: 100px;
  padding: 22px 8px 40px 44px;;
  color: #333;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}
.stage-block.active {
  background-color: #ffcc99;
}
.stage-block.closed {
  background-color: #ffd9b3;
}
.stage-block.pending {
  background-color: #f0f0f0;
  color: #999;
}
.stage-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: break-spaces;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.16px;
}
.stage-status,
.stage-date {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
  position: absolute;
  right: 4.999px;
  bottom: 12px;
  display: flex;
  padding: 2px 6px;
  align-items: center;
  gap: 10px;
}

.arrow-connector {
  width: 0;
  height: 0;
  border-top: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 20px solid;
  flex-shrink: 0;
}
.arrow-connector.active {
  color: #ffcc99;
}
.arrow-connector.closed {
  color: #ffd9b3;
}
.arrow-connector.pending {
  color: #f0f0f0;
}
</style>
